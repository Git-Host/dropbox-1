let fs = require('fs')
let express = require('express')
let morgan = require('morgan')
let path = require('path')
let nodeify = require(`bluebird-nodeify`)
let mime = require('mime-types')
let rimraf = require('rimraf')
let mkdirp = require('mkdirp')

require('songbird')

const NODE_ENV = process.env.NODE_ENV || 'development'
const NODE_PORT = process.env.PORT || 8000
const ROOT_DIR = path.resolve(process.cwd())

let app = express()

if(NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

app.listen(NODE_PORT, () => console.log(`Listening to http://127.0.0.1:${NODE_PORT}`))

app.head('*', setMetaData, setHeaders, (req, res) => res.end())

app.get('*', setMetaData, setHeaders, (req, res) => {
	if (res.body) {
		res.json(res.body)
		return
	}
	fs.createReadStream(req.filePath).pipe(res)
})

app.delete('*', setMetaData, (req, res, next) => {
	async () => {
		if(!req.stat) {
			return res.send(400, 'Invalid Path')
		}
		if(req.stat && req.stat.isDirectory()) {
			await rimraf.promise(req.filePath)
		} else {
			await fs.promise.unlink(req.filePath)
		}
		res.end()
	}().catch(next)
})

app.put('*', setMetaData, setDirDetails, (req, res, next) => {
	async () => {
		if(req.stat) return res.send(405, 'File exists')
		await mkdirp.promise(req.dirPath)
		if(!req.isDirectory) req.pipe(fs.createWriteStream(req.filePath))
		res.end()
	}().catch(next)
})

app.post('*', setMetaData, setDirDetails, (req, res, next) => {
	async () => {
		if(!req.stat) return res.send(405, 'File does not exists')
		if(req.isDirectory) return res.send(405, 'Updating directories not allowed')
		await fs.promise.truncate(req.filePath, 0)
		req.pipe(fs.createWriteStream(req.filePath))
		res.end()
	}().catch(next)
})

function setDirDetails(req, res, next) {

	let filePath = req.filePath
	let endsWithASlash = filePath.charAt(filePath.length - 1) === path.sep
	let hasExtension = path.extname(filePath) !== '';

	req.isDirectory = endsWithASlash || !hasExtension
	req.dirPath = req.isDirectory ? filePath : path.dirname(filePath)

	next()
}

function setMetaData(req, res, next) {
	nodeify(async () => {
		req.filePath = path.resolve(path.join(ROOT_DIR, req.url))		
		if (req.filePath.indexOf(ROOT_DIR) !== 0) {
			res.send(400, 'Invalid Request')
			return
		}
		req.stat = await fs.promise.stat(req.filePath)
	}().catch(() => req.stat = null), next)
}

function setHeaders(req, res, next) {
	nodeify(async() => {
		// if the request is for a directory
		if(req.stat.isDirectory()) {
			let files = await fs.promise.readdir(req.filePath)
			res.body = JSON.stringify(files)
			res.setHeader('Content-Type', 'application/json')
			res.setHeader('Content-Length', res.body.length)
			return
		}

		// if the request if for a file
		let contentType = mime.contentType(path.extname(req.filePath))
		res.setHeader('Content-Type', contentType)
		res.setHeader('Content-Length', req.stat.size)
	}(), next)
}