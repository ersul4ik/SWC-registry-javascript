class Reporter{
  	static toText(issues) {
  		  for(var issue of issues){
  		  	console.log("----------------------------------")
      		issue.print()
  		} 
	}
}


module.exports = Reporter;