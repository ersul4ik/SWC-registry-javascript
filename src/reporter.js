class Reporter{
  	static toText(issues) {
  		  for(var issue of issues){
      		issue.print()
  		} 
	}
}


module.exports = Reporter;