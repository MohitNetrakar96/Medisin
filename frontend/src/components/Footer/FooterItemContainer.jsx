import FooterItem from "./FooterItem";
import { SUPPORT, ABOUTUS, LEARNMORE } from "./FooterMenu";
const FooterItemContainer = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16">
            <FooterItem Links={ABOUTUS} title="ABOUT MEDISIN" />
            <FooterItem Links={LEARNMORE} title="LEARN MORE" />
            <FooterItem Links={SUPPORT} title="SUPPORT" />
        </div>
    )
};

export default FooterItemContainer;
