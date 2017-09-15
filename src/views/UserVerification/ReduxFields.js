import React from 'react'

export const renderText = ({ input, label, className, style, type, meta: {touched, invalid, error }}) => (
	<div className="mt-3">
		<div>{label}</div>
		<div className="mt-1">
			<input  {...input} type={type} style={style} className={className}/>
		</div>
		<div style={{color: 'red'}}>
		      { touched ? error : '' }
		</div>
	</div>
);
export const renderTextArea = ({input,label, className, style, meta: { touched, error, warning }}) => (
    <div className="mt-3">
		<div>{label}</div>
		<div className="mt-1">
			  <textarea {...input} style={style} className={className} rows='4' />
		</div>
		<div style={{color: 'red'}}>
		      { touched ? error : '' }
		</div>
	</div>
);
export const renderSelect = ({input,label,options, className, style, meta: { touched, error, warning }}) => {
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


export const renderInputFile = ({ input, label, className, style, type, meta: {touched, invalid, error } }) => (
	<div className="mt-3">
		<div>{label}</div>
		<div className="mt-1">
			<input
				type="file"
				style={style}
				className={className}
				multiple="false"
				onChange={(ev) => input.onChange(ev.target.files[0])}
			/>
		</div>
		<div style={{color: 'red'}}>
					{ touched ? error : '' }
		</div>
	</div>
);
