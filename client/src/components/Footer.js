import { Footer as ArwesFooter, Paragraph } from "arwes";
import Centered from "./Centered";

const Footer = () => {
  return <ArwesFooter animate>
    <Centered>
      <Paragraph style={{ fontSize: 14, margin: "10px 0",text:"center" }}>
        This is not an official site and is not affiliated with NASA or SpaceX in any way. For learning purposes only.
        {/* All right © Prashant */}
      </Paragraph>
    </Centered>
  </ArwesFooter>
};

export default Footer;
