import landingImage from "../assets/landing.png";
import appDownloadImage from "../assets/appDownload.png";

const HomePage = () => {
  return(
      <div className="flex flex-col gap-12">
        <div className="bg-white rounded-lg shadow-md py-8 flex flex-col gap-5 text-center -mt-16">
          <h1 className="text-5xl font-bold tracking-tight text-orange-600">
            Enjoy every bite you eat
          </h1>
          <span className="text-xl">Food is just a click away!</span>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <img src={landingImage} />
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <span className="font-bold text-3xl tracking-tighter">
              Order Eats even <i>faster!</i>
            </span>
            <span>
              Download the EveryEats App for <i>faster</i> ordering and <i>personalized </i>
              recommendations
            </span>
            <img src={appDownloadImage} />
          </div>
        </div>
      </div>
    )
}

export default HomePage;