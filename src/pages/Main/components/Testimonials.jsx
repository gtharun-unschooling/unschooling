import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Testimonials = () => {
  const testimonials = [
    {
      text: "My child started cooking at age 5! The hands-on approach has made learning so much more engaging.",
      author: "Priya Reddy, Hyderabad",
    },
    {
      text: "We play and learn together every week. It's amazing to see how much confidence my daughter has gained.",
      author: "Ravi Kumar, Hyderabad",
    },
    {
      text: "Best investment I made for my kid. The personalized learning plan has transformed our home education.",
      author: "Neha Sharma, Hyderabad",
    },
    {
      text: "The Essential Growth activities have helped my son develop skills I never thought possible at his age.",
      author: "Anita Rao, Hyderabad",
    },
    {
      text: "From art to science, my child explores everything with such enthusiasm. Unschooling truly works!",
      author: "Suresh Naidu, Hyderabad",
    },
    {
      text: "The 4-week plans are perfectly structured. My child looks forward to learning every single day.",
      author: "Meera Iyer, Hyderabad",
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
    <section className="testimonials-section" style={testimonialStyles.section}>
      <h2 style={testimonialStyles.heading}>What Parents Say</h2>
      <div style={{ position: 'relative' }}>
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{ 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet-custom',
            bulletActiveClass: 'swiper-pagination-bullet-active-custom'
          }}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
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
        
        {/* Custom Navigation Arrows */}
        <div 
          className="swiper-button-prev-custom"
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '50px',
            height: '50px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '2px solid #667eea',
            transition: 'all 0.3s ease',
            fontSize: '18px',
            color: '#667eea',
            fontWeight: 'bold'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#667eea';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            e.target.style.color = '#667eea';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          ‹
        </div>
        
        <div 
          className="swiper-button-next-custom"
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '50px',
            height: '50px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '2px solid #667eea',
            transition: 'all 0.3s ease',
            fontSize: '18px',
            color: '#667eea',
            fontWeight: 'bold'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#667eea';
            e.target.style.color = 'white';
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            e.target.style.color = '#667eea';
            e.target.style.transform = 'translateY(-50%) scale(1)';
          }}
        >
          ›
        </div>
      </div>
      
      {/* Custom Pagination Styles */}
      <style jsx>{`
        :global(.swiper-pagination-bullet-custom) {
          width: 12px !important;
          height: 12px !important;
          background: rgba(102, 126, 234, 0.3) !important;
          opacity: 1 !important;
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
        }
        
        :global(.swiper-pagination-bullet-active-custom) {
          background: #667eea !important;
          transform: scale(1.2) !important;
        }
        
        :global(.swiper-pagination) {
          bottom: 20px !important;
          position: relative !important;
          margin-top: 30px !important;
        }
      `}</style>
    </section>
  );
};

export default Testimonials; 