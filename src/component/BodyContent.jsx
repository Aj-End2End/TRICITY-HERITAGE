import React from "react";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { FaWpforms } from "react-icons/fa";
import FormModal from "./FormModal";
import { useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const images = [
  "images/BANNER/TRICITY HERITAGE - BANNER 2.jpg",
  "images/BANNER/TRICITY HERITAGE - BANNER 3.jpg",
  "images/BANNER/TRICITY HERITAGE - BANNER 4.jpg",
];

const data = [
  { type: "2 BHK", area: 628, price: "85.32 Lacs* ++" },
  { type: "2 BHK", area: 634, price: "86.11 Lacs* ++" },
  { type: "2 BHK", area: 651, price: "88.46 Lacs* ++" },
];

const galleryImages = [
  "images/GALLERY/TRICITY HERITAGE - GALLERY 1.jpg",
  "images/GALLERY/TRICITY HERITAGE - GALLERY 2.jpg",
  "images/GALLERY/TRICITY HERITAGE - GALLERY 3.jpg",
  "images/GALLERY/TRICITY HERITAGE - GALLERY 5.jpg",
  "images/GALLERY/TRICITY HERITAGE - GALLERY 4.jpg",
  "images/GALLERY/TRICITY HERITAGE - GALLERY 6.jpg",
];

const floorImages = ["images/FLOOR PLAN/2.jpg"];

const aminitiesImages = [
  {
    src: "images/AMENITIES/TRICITY HERITAGE - AMENITIES 6.jpg",
    label: "Landscape Garden",
  },
  {
    src: "images/AMENITIES/TRICITY HERITAGE - AMENITIES 7.jpg",
    label: "Sitting Area",
  },
  {
    src: "images/AMENITIES/TRICITY HERITAGE - AMENITIES 1.jpg",
    label: "Gymnasium",
  },
  {
    src: "images/AMENITIES/TRICITY HERITAGE - AMENITIES 5.jpg",
    label: "Yoga and Meditation Center",
  },
  {
    src: "images/AMENITIES/TRICITY HERITAGE - AMENITIES 3.jpg",
    label: "Indoor Games",
  },
  {
    src: "images/AMENITIES/TRICITY HERITAGE - AMENITIES 4.jpg",
    label: "Kid's Play Area",
  },
];

const BodyContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [modalButtonTitle, setModalButtonTitle] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [floor, setFloor] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const totalImages = images.length;
  const totalFloors = floorImages.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalImages]);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  const prevSlide2 = () => {
    setFloor((prevFloor) =>
      prevFloor === 0 ? totalFloors - 1 : prevFloor - 1
    );
  };

  const nextSlide2 = () => {
    setFloor((prevFloor) => (prevFloor + 1) % totalFloors);
  };

  const handleOpenModal = (title) => {
    setModalButtonTitle(title);
    setOpen(true);
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .required("Phone is required")
      .matches(/^\d{10}$/, "Phone number must be 10 digits long"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append("Name", values.name);
      formData.append("Phone", values.phone);

      const crmData = {
        name: values.name,
        phone: values.phone,
        listId: "67cfc50332f6b114bf90d0d4", // Add your listId for CRM
        redirect: "", // Add your redirect URL for CRM
      };

      try {
        setIsSubmitted(true);

        // Send data to Google Sheets
        await fetch(
          "https://script.google.com/macros/s/AKfycbzRmsbOivyvnFFkw48XEqSe0QOylHFDVgK_2z-HI5VUQeJDzc4zY_-g2YEVRf9DNSbE/exec",
          {
            method: "POST",
            body: formData,
          }
        );

        // Send data to CRM
        await fetch(
          "https://enterprise.godial.cc/meta/api/externals/contact/add?access_token=nLWC3eZkuDXNbcElB7wXENJZCMM15hmG7GnDJKs6Zdcxqbh4AHq7o24nAiD43K0e",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(crmData),
          }
        );

        formik.resetForm({ name: "", phone: ""});

        resetForm();

        // Redirect to thank-you page
        navigate("/thank-you");
      } catch (error) {
        setFormError(true);
        console.log(error);
      }
    },
  });

  return (
    <>
      <div>
        <div className="flex flex-col lg:flex-row " id="home">
          <div className="relative w-full lg:w-[70%] sm:h-80 md:h-96 h-1/2 lg:h-screen xl:h-[600px]">
            <img
              src={images[currentIndex]}
              alt="slider"
              className="w-full h-full object-cover"
            />
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl text-white p-2 rounded-full"
              onClick={prevSlide}
            >
              <img
                src="images/LEFT_ARR-removebg-preview.png"
                alt="Previous"
                className="w-6 h-6" // Adjust the width and height to match the size of the ChevronLeft icon
              />
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl text-white p-2 rounded-full"
              onClick={nextSlide}
            >
              <img
                src="images/RIGHT_ARR__2_-removebg-preview.png"
                alt="Previous"
                className="w-6 h-6" // Adjust the width and height to match the size of the ChevronLeft icon
              />
            </button>
          </div>
          <div className="w-full lg:w-[30%] h-auto lg:h-full bg-[#f7f5dd] p-4 flex flex-col items-center border-5 border-[#126958] sm:border-5 lg:border-none">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4">
              TRICITY HERITAGE, PANVEL
            </h2>
            <div className="flex flex-col items-center border-2 border-black m-2 text-center w-full">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                Exclusive Elite Living
              </h2>
              <p className="text-sm sm:text-base lg:text-lg mt-2 mb-[7px] font-[700] border-4 border-[#126958] text-[#eee4e4] bg-[#126958] w-full">
                2 Bed Homes: 85.32 Lacs*++
              </p>
            </div>

            <button
              className="relative w-full sm:w-4/5 h-[50px] sm:h-[45px] lg:h-[50px] border-none outline-none text-white bg-[#126958] cursor-pointer z-0 rounded-lg m-2 mt-3 text-sm sm:text-base lg:text-lg font-bold transition duration-300 hover:text-[#126958] glow-on-hover"
              onClick={() => handleOpenModal("Enquiry")}
            >
              BOOK NOW
            </button>

            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-3 mt-3">
              TRICITY HERITAGE, PANVEL
            </h2>

            {/* <img
              src="images/TRICITY ASPIRE - LOGO.png"
              alt="logo"
              className="w-40 h-40"
            /> */}

            <button
              className="relative w-full sm:w-4/5 h-[50px] sm:h-[45px] lg:h-[50px] border-none outline-none text-white bg-[#126958] cursor-pointer z-0 rounded-lg m-2 text-sm sm:text-sx md:text-base lg:text-lg font-bold transition duration-300 hover:text-[#126958] glow-on-hover"
              onClick={() => handleOpenModal("Download E Brochure")}
            >
              Download E Brochure
            </button>
          </div>
        </div>

        <div className="bg-[#f7f5dd] w-full text-start" id="about">
          <div className="w-full max-w-7xl p-4 text-start">
            <h1 className="my-4 text-2xl sm:text-4xl md:text-5xl lg:text-[48px] lg:font-bold font-semibold uppercase text-black-700 text-center">
              TRICITY HERITAGE
            </h1>
            <p className="text-gray-900 sm:text-lg md:text-lg lg:text-xl xl:text-xl mb-4 sm:mb-6 text-justify">
              <b className="font-bold">TRICITY HERITAGE...</b> The project is
              located in Sector 21, New Panvel, Navi Mumbai. It offers 2 BHK
              Apartments along with Commercial Shops. Located in prime location
              in close proximity to Panvel Railway Station, it offers seamless
              connectivity to Mumbai, Pune and other significant Urban Centers,
              making it an ideal destination for those seeking both convenience
              and accessibility. The project is equipped with numerous
              facilities and amenities, enhancing resident’s lifestyle and
              living experience.
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-6 mb-4">
              Tower Features
            </h2>
            <ul className="list-disc pl-5 text-black sm:text-black md:text-lg lg:text-lg xl:text-xl ">
              <li>01 Acre CIDCO TENDER PLOT</li>
              <li className="mb-1">Panvel City Skyline Icon</li>
              <li className="mb-1">2 Bed Luxury Residences</li>
              <li className="mb-1">Promising Precinct of Panvel township</li>
              <li className="mb-1">Modern Lifestyle Amenities</li>
              <li className="mb-1">5 Mins from Panvel Railway Station</li>
              <li className="mb-1">Uninterrupted View of Cityscapes</li>
            </ul>
          </div>
        </div>

        <div className="price-overview justify-center" id="price-overview">
          <div className="border-[20px] border-solid border-[#126958] bg-[#f7f5dd] pb-3 sm:border-[20px] md:border-[15px] lg:border-[20px]">
            <h1 className="text-center my-4 text-2xl sm:text-4xl md:text-5xl lg:text-[48px] lg:font-bold font-semibold uppercase text-black-800">
              PRICE OVERVIEW
            </h1>
            <table className="table border-1 border-black w-full">
              <thead className="bg-gray-50 text-center">
                <tr className="border-1">
                  <th className="border-1 px-[11px] py-3 text-xs sm:text-sm md:text-base lg:text-[16px] font-medium text-gray-500 uppercase tracking-wider transition-all duration-300 text-center">
                    Typology
                  </th>
                  <th className="border-1 px-[11px] py-3 text-xs sm:text-sm md:text-base lg:text-[16px] font-medium text-gray-500 transition-all duration-300 text-center">
                    CARPET AREA (Sq Ft)
                  </th>
                  <th className="border-1 px-[11px] py-3 text-xs sm:text-sm md:text-base lg:text-[16px] font-medium text-gray-500 uppercase tracking-wider transition-all duration-300 text-center">
                    PRICE
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={index}
                    className="border-1 border-black odd:bg-[#f7f5dd] even:bg-red"
                  >
                    <td className="border-1 text-center">{row.type}</td>
                    <td className="border-1 text-center">{row.area}</td>
                    <td className="border-1 text-center">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="container mx-auto px-1 sm:px-8" id="gallery">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-center my-8 transition-all duration-300">
            GALLERY
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[1vh] p-[1vh] max-w-full mx-auto bg-[#126958] justify-center">
            {galleryImages.map((src, index) => (
              <div className="gallery-item group" key={index}>
                <img
                  src={src}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-[300px] object-cover transition-all duration-100 ease-out group-hover:scale-104 group-hover:filter-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="featured-listings" id="amenities">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-center my-8 transition-all duration-300">
            AMENITIES
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 lg:max-w-[60%] lg:mx-auto">
            {aminitiesImages.map((item, index) => (
              <div className="aminitiesImage-item" key={index}>
                <img
                  className="w-full h-48 object-cover"
                  src={item.src}
                  alt={`Gallery ${index + 1}`}
                />
                <h2
                  className="text-center m-2"
                  style={{ fontSize: "24px", fontWeight: "bold" }}
                >
                  {item.label}
                </h2>
              </div>
            ))}
          </div>
        </div>

        <section id="virtual-tour">
          <div className="content">
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-center my-8 transition-all duration-300">
              VIRTUAL TOUR
            </h1>
            <div className="section-header-underline" />
            <div className="video-gallery lg:flex md:flex">
              <div
                className="gallery-item "
                onClick={() => handleOpenModal("Enquiry")}
              >
                <img
                  src="images/GALLERY/TRICITY HERITAGE - GALLERY 1.jpg"
                  alt="Prestige Jasdan Classic Tour"
                />
                <div className="gallery-item-caption">
                  <div>
                    <h2
                      className="text-center"
                      style={{ fontSize: "1.5em", fontWeight: "400" }}
                    >
                      TRICITY HERITAGE{" "}
                    </h2>
                    <p />
                  </div>
                </div>
              </div>
              <div
                className="gallery-item"
                onClick={() => handleOpenModal("Enquiry")}
              >
                <img
                  src="images/GALLERY/TRICITY HERITAGE - GALLERY 2.jpg"
                  alt="Home Tour"
                />
                <div className="gallery-item-caption">
                  <div>
                    <h2
                      className="text-center"
                      style={{ fontSize: "1.5em", fontWeight: "400" }}
                    >
                      Sample Flat
                    </h2>
                    <p />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="floor-plan">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-center my-8 transition-all duration-300">
            FLOOR PLANS
          </h1>
          <div className="container-fl">
            <div className="sliderer">
              <div
                className="slider__slides"
                onClick={() => handleOpenModal("Enquiry")}
              >
                <div className="slider__slide active">
                  <img
                    src={floorImages[floor]}
                    alt="slider"
                    className="slider-image"
                  />
                </div>
              </div>
              <div
                id="nav-button--prev"
                className="slider__nav-button"
                onClick={prevSlide2}
              />
              <div
                id="nav-button--next"
                className="slider__nav-button"
                onClick={nextSlide2}
              />
              <div className="slider__nav">
                {floorImages.map((_, index) => (
                  <div
                    key={index}
                    className={`slider__navlink ${
                      index === floor ? "active" : ""
                    }`}
                    onClick={() => setFloor(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="maps">
          <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-center my-8 transition-all duration-300">
            LOCATION MAP
          </h1>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15091.372677469515!2d73.1218672!3d18.9825324!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e9feea5e840f%3A0x47719f5e81198816!2sTricity%20Heritage!5e0!3m2!1sen!2sin!4v1727087039796!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          ></iframe>
        </section>

        <section
          id="contact-us"
          className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
        >
          <h1 className="text-center my-4 text-2xl sm:text-3xl md:text-4xl lg:text-[48px] lg:font-bold font-semibold uppercase text-black-800">
            CONTACT US
          </h1>

          <div className="flex justify-center items-center mb-6">
            <FaPhone
              onClick={() => window.open("tel:9326959938")}
              style={{
                color: "white",
                backgroundColor: "green",
                borderRadius: "50%",
                fontSize: "30px",
                padding: "5px",
                marginRight: "10px",
              }}
            />
            <span
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl cursor-pointer"
              onClick={() => window.open("tel:9326959938")}
            >
              {" "}
              +91 93269 59938
            </span>
          </div>

          <h3 className="text-center text-sm font-black sm:text-4xl md:text-lg lg:text-xl font-calibri mb-6">
            Exclusive Limited Time Offer: Unbeatable Discounts Await You!
          </h3>

          <div className="container-f mx-auto max-w-xl">
            {isSubmitted && !formError ? (
              <div className="w-2/5 text-center bg-[#126958] text-[#fff] mx-auto py-2 border-1 border-[#520808]">
                <h4 className="text-2xl">Successfully Submitted</h4>
                <h3 className="text-xl">
                  Thank you! We will contact you soon.
                </h3>
              </div>
            ) : formError ? (
              <div className="text-center bg-[#ffff00] text-[#E72744] mx-4 p-4 border-1 border-[#520808]">
                <p className="text-2xl">
                  Something went wrong. Please try again.
                </p>
              </div>
            ) : (
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="form-group">
                  <input
                    className="form-control w-full px-4 py-2 text-sm sm:text-base md:text-lg border rounded-md"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <span className="text-red-500 text-sm">
                      {formik.errors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <input
                    className="form-control w-full px-4 py-2 text-sm sm:text-base md:text-lg border rounded-md"
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="Enter your number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <span className="text-red-500 text-sm">
                      {formik.errors.phone}
                    </span>
                  )}
                </div>

                <button
                  className="glow-on-hover w-full py-auto px-4 text-white rounded-md text-xs sm:text-sm md:text-lg lg:text-xl"
                  type="submit"
                >
                  Book Free Pickup & Drop
                </button>
              </form>
            )}
          </div>
        </section>

        <div className="foot_top bg-gray-800 text-white py-8 text-center">
          <div className="container mx-auto px-4">
            <div className="row">
              <div className="col-md-12 mx-auto">
                <div className="foot_left">
                  <h1 className="text-2xl md:text-4xl font-bold">
                    TRICITY HERITAGE
                  </h1>
                  <p className="mt-4 text-base md:text-lg text-justify">
                    Disclaimer: This website is meant only for information
                    purposes. It should not be considered / claimed as an
                    official site. This website belongs to the authorized
                    channel partner of Tricity Group. The content provided on
                    this website is for information purposes only and does not
                    constitute an offer to avail any service. The prices
                    mentioned are subject to change without prior notice, and
                    the availability of properties mentioned is not guaranteed.
                    The images displayed on the website are for representation
                    purposes only and may not reflect the actual properties
                    accurately. We may share data with Real Estate Regulatory
                    Authority (RERA) registered brokers/companies for further
                    processing as required. We may also send updates and
                    information to the mobile number or email ID registered with
                    us. All rights reserved. The content, design, and
                    information on this website are protected by copyright and
                    other intellectual property rights. Any unauthorized use or
                    reproduction of the content may violate applicable laws.
                  </p>
                </div>
                <h3 className="text-center justify" style={{ color: "#fff" }}>
                  MahaRERA registration number: P52000077294
                  maharera.mahaonline.gov.in
                </h3>

                <h3 className="text-center justify" style={{ color: "#fff" }}>
                  MahaRERA registration number: A52000032416
                  maharera.mahaonline.gov.in
                </h3>
              </div>
            </div>
          </div>
          <div className="qr-dis mt-6 flex justify-center">
            <img
              className="qr-logo w-26 md:w-39"
              src="images/QR.jpg"
              alt="QR-logo"
            />
          </div>
        </div>

        <div className="fixed bottom-20 right-10">
          <button
            className="bg-green-400 text-white p-2 mb-3 rounded-full shadow-lg"
            onClick={() => handleOpenModal("Enquiry")}
          >
            <i
              className="floating"
              href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"
            >
              <FaWpforms size={30} />
            </i>
          </button>
        </div>

        <a
          href="https://api.whatsapp.com/send?phone=9326959938&text=I am interested in TRICITY HERITAGE, Panvel project and want more information about this project."
          className="floating-button"
          target="_blank"
          rel="noreferrer"
        >
          <div className="floating-btn">
            <FaWhatsapp size={30} />
          </div>
        </a>

        {/* <TestModal onClose="" tile=""  /> */}
        <FormModal
          open={open}
          onClose={() => setOpen(false)}
          formTitle="TRICITY HERITAGE, PANVEL"
          formSubTitle="Register here for Best Offers"
          buttonTitle={modalButtonTitle}
        />
      </div>
    </>
  );
};

export default BodyContent;
