import React from 'react';

export default ({input,label,options, className, style, meta: { touched, error, warning }}) => {
	return(
	    <div className="mt-3">
	    	<div>{label}</div>
		    <div className="mt-1">
		        <select {...input} style={style} className={className}>
		          <option value="">Select</option>
		          { options.map((item,index)=>(
		          	 <option key={index} value={item}>{item}</option>
		          	))
		          }
		        </select>
	        </div>
	        <div style={{color: 'red'}}>
		      { touched ? error : '' }
		</div>
	    </div>
	);
}
