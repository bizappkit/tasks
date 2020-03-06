import { ReactNode } from "react";

export interface ContentContainerProps {
	children: ReactNode
}

export function ContentContainer(props: ContentContainerProps) {
	return (
		<div className="container">
		<div className="row justify-content-center">
		  <div className="col-lg-9">
			<div className="text-center d-flex align-items-center justify-content-center pt-5">
				{props.children}
			</div>
		  </div>
		</div>
	  </div>
	)
}