const FileUtils = require('../src/file_utils.js')
const Analyzer  = require('../src/analyzer.js')
const fs = require('fs');

class Repository {
	constructor(){
		this.files = {}
		this.issues = []
		this.commitHash = ""
	}

	addIssue(issue){
		this.issues.push(issue)
	}

	addIssues(issues){
		this.issues.concat(issues)
	}

	addFile(filename, filecontent){
		this.files[filename] = filecontent
	}

	addFiles(directory, pattern){
	    var filenames = FileUtils.searchRecursive(directory,pattern)
        for(var filename of filenames){
            const contract_content = fs.readFileSync(filename).toString()
            this.addFile(filename,contract_content)
        }
	}

	scan(){
        Object.keys(files).forEach(function (filename) {
            var filecontent = files[filename]
            Analyzer.checkInsecureArithmetic(filecontent)
        })
    }

}

module.exports =  Repository
