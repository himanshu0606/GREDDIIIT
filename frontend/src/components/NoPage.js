import React from 'react'
import "../style/NoPage.css"

export default function NoPage() {
    return (
        <div>
            <section className="page_404">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 ">
                            <div className="col-sm-10 col-sm-offset-1  text-center">
                                <div className="four_zero_four_bg">
                                    <h1 className="text-center" style={{fontWeight:"700",textAlign:"center'"}}>404 Page Not Found</h1>
                                </div>

                                <div className="contant_box_404">
                                    <h2 className="h2">
                                        Look like you're lost
                                    </h2>
                                    <h3>the page you are looking for not avaible!</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
