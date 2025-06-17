import React from 'react';



const BookAnimation: React.FC = () => {
  

    return (
        <div className="flex items-center justify-center h-[90vh] bg-[#ffffff] w-[70vw]">
          <div className="relative w-20 h-12">
            <span className="absolute bottom-0 w-4 h-4 bg-[#1d2c30] rounded-full transform translate-x-16 animate-loading-ball">
              <span className="absolute w-full h-full bg-[#6f9ca9] rounded-full animate-loading-ball-inner"></span>
            </span>
          </div>
        </div>
      );
};

export default BookAnimation;
