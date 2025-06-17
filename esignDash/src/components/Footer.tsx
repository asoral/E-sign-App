import React from 'react';
import DexcissLogo from '../assets/Dexciss_logo.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#283C42] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img
              src={DexcissLogo}
              alt="Dexciss Logo"
              width={150}
              height={50}
            />
          </div>
          
          <div>
            <h5 className="text-xl font-bold mb-4">Links</h5>
            <ul className="space-y-2">
              {['Home', 'Product', 'About us', 'Blog', 'Sitemap'].map((item) => (
                <li key={item}>
                  {/* Uncomment and use Link from your routing library */}
                  {/* <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-gray-300 transition-colors"> */}
                    {/* {item} */}
                  {/* </Link> */}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="text-xl font-bold mb-4">Legal</h5>
            <ul className="space-y-2">
              {['Terms of use', 'Terms & conditions', 'Privacy policy', 'Help & support'].map((item) => (
                <li key={item}>
                  {/* Uncomment and use Link from your routing library */}
                  {/* <Link href={`/${item.toLowerCase().replace(' ', '-').replace('&', '')}`} className="hover:text-gray-300 transition-colors"> */}
                    {item}
                  {/* </Link> */}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h5 className="text-xl font-bold mb-4">About Us</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'India',
                  company: 'Dexciss Technology Pvt. Ltd.',
                  address: [
                    'Brand Square - Yashada Realty 612',
                    'Kunjir Chowk (PCMC)',
                    'Pune - 411061',
                    'Maharashtra, India'
                  ],
                  email: 'asoral@dexciss.com',
                  phone: '+91 8860008604'
                },
                {
                  title: 'US',
                  company: 'Dexciss Technology LLC',
                  address: [
                    '447 Broadway FL 2 312',
                    'New York, NY 10013',
                    'United States'
                  ],
                  email: 'asoral@dexciss.com',
                  phone: '+1 3476947031'
                }
              ].map((location) => (
                <div key={location.title} className="space-y-2">
                  <h6 className="font-semibold">{location.title}</h6>
                  <p className="text-sm">{location.company}</p>
                  {location.address.map((line) => (
                    <p key={line} className="text-sm">{line}</p>
                  ))}
                  <p className="text-sm">Email: {location.email}</p>
                  <p className="text-sm">Phone: {location.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Dexciss Technology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
