import "./Searchbar.css";
import bannerImg from '../../assets/Searchbar-img.png'

const Searchbar = () => {
  return (
    <div className="Hero-Banner" style={{backgroundImage: `url(${bannerImg})`}}>
      <div className="Overlay">
        <h1 className="">
          Find & book your <br />
          perfect table.
        </h1>
        <div className="">Search Engine</div>
      </div>
    </div>
  );
};

export default Searchbar;
