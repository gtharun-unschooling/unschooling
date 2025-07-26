import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Testimonials = () => {
  const testimonials = [
    {
      text: "My child started cooking at age 5!",
      author: "Priya, Hyderabad",
    },
    {
      text: "We play and learn together every week.",
      author: "Ravi, Bengaluru",
    },
    {
      text: "Best investment I made for my kid.",
      author: "Neha, Pune",
    },
  ];

  const testimonialStyles = {
    section: {
      padding: '5vh 5vw',
      backgroundColor: '#fffaf0',
    },
    heading: {
      textAlign: 'center',
      fontSize: '2.5rem',
      marginBottom: '2rem',
      color: '#333',
      fontWeight: 'bold',
    },
    slide: {
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto',
    },
    text: {
      fontSize: '1.2rem',
      fontStyle: 'italic',
      color: '#444',
    },
    author: {
      marginTop: '1rem',
      fontWeight: 'bold',
      color: '#555',
    },
  };

  return (
    <section style={testimonialStyles.section}>
      <h2 style={testimonialStyles.heading}>What Parents Say</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={30}
        slidesPerView={1}
      >
        {testimonials.map((t, index) => (
          <SwiperSlide key={index}>
            <div style={testimonialStyles.slide}>
              <p style={testimonialStyles.text}>"{t.text}"</p>
              <p style={testimonialStyles.author}>— {t.author}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials; 