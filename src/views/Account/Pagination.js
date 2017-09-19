import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
 
class Pagination extends Component {
	render() {
	 	const { currentPage, pageLength }=this.props
 		var pageNumbers = [];
	    for (let i = 1; i <= pageLength; i++) {
	      	pageNumbers.push(i);
	    }
	    if(pageLength<=5){
	    	var activePageNumbers=pageNumbers.map(number => {
	    		return(
	    			<li  key={number} className={currentPage==number?"page-item active":'page-item'} >
			        	<a className="page-link" id={number} onClick={this.handleClick}>{number}</a>
			        </li>
	    		)
	    	})
	    }
	    else{
	    	var active=[currentPage,currentPage+1]
		   	var activePageNumbers=active.map(number=>{
		   		if(number<pageLength-2){
		   			return(
			   			<li  key={number} className={currentPage==number?"page-item active":'page-item'} >
				        	<a className="page-link" id={number} onClick={this.handleClick}>{number}</a>
				        </li>
				    )
		   		}
		   	})
	    }
		return (
				<div id="page-numbers" className='row justify-content-center mt-2'>
				  	<nav className="my-4">
				  		 <ul className="pagination  mb-0">
				  		 	{currentPage==1?null:
				  		 		<ul className="pagination mb-0">
						  		 	<li className={currentPage==1?"page-item disabled":null}>
						  		 		<a className="page-link" onClick={this.handleFirst}>First</a>
						  		 	</li>   
							        <li className={currentPage==1?"page-item disabled":null}>
							            <a className="page-link" aria-label="Previous" onClick={this.handlePrevious}>
							                <span aria-hidden="true">&laquo;</span>
							            </a>
							        </li>
						        </ul>
						    }
					        {activePageNumbers}
					        {pageLength <=5 ? null : 
					        	<ul className="pagination mb-0">
						 	        {currentPage+1>=pageLength-2?
						 	        	<li className={currentPage==pageLength-2?"page-item active":'page-item'} >
						 		        	<a className="page-link" id={pageLength-2} onClick={this.handleClick}>{pageLength-2}</a>
						 		        </li>
						 		        :
						 	        	<li className="page-item disabled"><a className="page-link active">...</a></li>
						 	        }
						 	        <li className={currentPage==pageLength-1?"page-item active":'page-item'}>
						 	        	 <a className="page-link" id={pageLength-1} onClick={this.handleClick}>{pageLength-1}</a>
						 	        </li>
						 	        <li className={currentPage==pageLength?"page-item active":'page-item'}>
						 	        	<a className="page-link" id={pageLength} onClick={this.handleClick}>{pageLength}</a>
						 	        </li>
						 	    </ul>
					        }
					        {currentPage==pageLength?null:
						        <ul className="pagination mb-0">
							        <li className={currentPage==pageLength?"page-item disabled":null}>
							            <a className="page-link" aria-label="Next" onClick={this.handleNext}>
							                <span aria-hidden="true">&raquo;</span>
							            </a>
							        </li>
							       <li className={currentPage==pageLength?"page-item disabled":null}>
						  		 		<a className="page-link" onClick={this.handleLast}>Last</a>
						  		 	</li>
					  		 	</ul>
				  		 	}
					    </ul>
					</nav>
			 	</div>
		);
	}
	handleClick=(event)=> {
		var id= Number(event.target.id)
	    this.props.handleClick(id);
	}
	handleNext=()=> {
	    this.props.handleNext();
	}
	handlePrevious=()=> {
	     this.props.handlePrevious();
	}
	handleFirst=()=> {
	    this.props.handleFirst();
	}
	handleLast=()=> {
		 this.props.handleLast(this.props.pageLength);
	}
}
 
export default Pagination;