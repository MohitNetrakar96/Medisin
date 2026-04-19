import FooterItemContainer from './FooterItemContainer';
import FooterLogo from './FooterLogo.png';

const Footer = () => {
  return (
    <footer className="text-white bg-black w-full">
      <FooterItemContainer />
      <div className="font-goliMedium grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center pt-2 text-gray-400 text-sm pb-8">
        <span>© MEDISIN 2025. All rights reserved.</span>
        <span>Terms · Privacy Policy</span>
        <span className="text-right md:mr-20">Designed and Developed by FlowerCreeper</span>
      </div>    
      <div className='mt-[8vw]'>
        <span>
          <img src={FooterLogo} />
        </span>
      </div>
    </footer>
  );
};

export default Footer;
