

class Issue{
	constructor(filename, contract, type, code, linenumber ) {
		this.filename = filename
		this.contract = contract
		this.type = type
		this.code = code
		this.linenr = linenumber
	}
}

module.exports = Issue 