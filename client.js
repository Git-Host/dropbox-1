let fs = require('fs')
let path = require('path')
let rimraf = require('rimraf')
let nssocket = require('nssocket')
let mkdirp = require('mkdirp')
let argv = require('yargs')
  .default('dir', process.cwd())
  .argv

require('songbird')

const ROOT_DIR = path.resolve(path.join(argv.dir, 'client'))
const HOST = process.env.HOST || '127.0.0.1'
const TCP_PORT = process.env.TCP_PORT || 9838  

let client = new nssocket.NsSocket()
client.data(['Sync'], (data) => {
	async () => {
		if(!data) {
			console.log('Invalid server response')
		} else {
			let action = data.action
			switch (action) {
				case 'delete':
					await deleteContents(data)					
					break
				case 'update':
					await updateContents(data)
					break
				case 'create':
					await createContents(data)
					break
				default:
					console.log("Not a vaild action")
					break
			}
		}
	}().catch(e => console.log(e))
})

let deleteContents = async (data) => {
	try {
		console.log(data)
		let isDir = data.type && data.type === 'dir'
		let filePath = path.join(ROOT_DIR, data.path)
		if(isDir) {
			await rimraf.promise(filePath)
		} else {
			await fs.promise.unlink(filePath)
		}	
	} catch(e) {
		console.log(e.stack)
	}
}

let updateContents = async (data) => {
	console.log('Updating files')
	console.log(data)
	let isDir = data.type && data.type === 'dir'
	let filePath = path.resolve(path.join(ROOT_DIR, data.path))
	if(isDir) {
		console.log('Updating directories not allowed')
	} else {
		await fs.promise.truncate(filePath, 0)
		await fs.promise.writeFile(filePath, data.contents)
	}
}

let createContents = async (data) => {
	console.log('Creating files')
	console.log(data)
	let isDir = data.type && data.type === 'dir'
	let filePath = path.resolve(path.join(ROOT_DIR, data.path))
	let dirPath = path.dirname(filePath)
	console.log(dirPath)
	await mkdirp.promise(dirPath)
	if (!isDir) {
		await fs.promise.writeFile(filePath, data.contents)
	} 
}

client.connect(TCP_PORT, HOST)