import meter1 from "../assets/img/image_2023-06-07_214651819-removebg-preview.png";
import meter2 from "../assets/img/image_2023-06-07_214940253-removebg-preview.png";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import arrow1 from "../assets/img/arrow1.svg";
import arrow2 from "../assets/img/arrow2.svg";
import colorSharp from "../assets/img/color-sharp.png"

export const About = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <section className="skill" id="about">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="skill-bx wow zoomIn">
                        <h2>About Us</h2>
                        <p>We are alums of ENSA FES ,interns at 3D Smart Factory. We are enthusiasts for all things digital - big believers in technology’s potential and even bigger believers in human potential.</p>
                          <h2>Team</h2>
                        <Carousel responsive={responsive} infinite={true} className="hello">
                            <div className="item">

                                <img src={meter1} alt="Image" />
                                <h5>ELANSARI Soukaina</h5>
                                <p>Front-end developer</p>
                            </div>

                            <div className="item">
                                <img src={meter2} alt="Image" />
                                <h5>AAMAROUCHI Oumaima</h5>
                                <p>Back-end developer</p>
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
        <img className="background-image-left" src={colorSharp} alt="Image" />
    </section>
  )
}
