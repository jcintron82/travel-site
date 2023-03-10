import "../../css/flightresults.css";
import "../../css/utility/home.css";
import adPicOne from '../../images/home/adone.avif'
import { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import { Header, name} from "./header";
import { TravelersPopup } from './numoftravalersmodal';
import { RefineSearchPopup } from './refinsesearchmodal';
import { RecommendedTab } from './recommendedtraveltabs'
import { travelerCounts} from "./numoftravalersmodal";
import { searchParams } from "./refinsesearchmodal";
export { FlightSearchModal, queryResponseObj };
const queryResponseObj = [];
const autocompleteAPIValuesHold = {};

function FlightSearchModal() {
  const [departureLocation, setDepartureLocation] = useState("");
  const [arrivalLocation, setArrivalLocation] = useState("");
  const [hotelOrFlight, sethotelOrFlight] = useState(true);
  const [roundTripSelected, setRoundTrip] = useState(false);
  const [queryRecieved, setQueryStatus] = useState();
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);

  const [travelersPopup, setTravelersPopupdults] = useState(false);
  const [refineSearchPopup, setRefineSearchPopup] = useState(false);
  const [stately, setStately] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(localStorage.getItem('username') ? "Where's your next adventure " + localStorage.getItem('username') + "?" : 'Arriving at...');

  const [autocompleteOne, setautocompleteOne] = useState("");
  const [autocompleteTwo, setautocompleteTwo] = useState("");
  const [autocompleteThree, setautocompleteThree] = useState("");

  const [autocompleteOneArrival, setautocompleteOneArrival] = useState("");
  const [autocompleteTwoArrival, setautocompleteTwoArrival] = useState("");
  const [autocompleteThreeArrival, setautocompleteThreeArrival] = useState("");
  const navigate = useNavigate();
  //The listings in this body aren't technically needed but they are there
  //for reference to easily know all the parameters being/which can be used
  const body = {
    departure: departureLocation,
    departureDate: "",
    arrival: arrivalLocation,
    returnDate: "",
    maxPrice: 5000,
    flightClass: "ECONOMY",
    adults:1,
    children:0,
    nonStop:false,
  };
  const flightQuery = async (e) => {
    body.adults = travelerCounts.adults;
    body.children = travelerCounts.children;
    body.maxPrice = searchParams.maxPrice;
    body.nonStop = searchParams.nonstop;
    body.flightClass = searchParams.cabinClass;
    e.preventDefault();
    body.departure = body.departure.slice(-3);
    body.arrival = body.arrival.slice(-3);
    console.log(body);
    try {
      const pull = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await pull.json();
      console.log(body);
    } catch (err) {
      console.log(err);
    }
    const pull = await fetch("http://localhost:8000/query");
    const data = await pull.json();
    // setDepartureLocation(data.message.data);
    setQueryStatus(!queryRecieved);
    queryResponseObj[0] = data;
    console.log(queryResponseObj);
    navigate("/flightquery");
    callCitySearchAPI();
    console.log(process.env.REACT_APP_CLIENT_ID);
    return { message: queryResponseObj };
  };

  const callCitySearchAPI = async (input) => {
    let token = "";
    const fetchAuth = await fetch(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      {
        body:
          "grant_type=client_credentials&client_id=" +
          process.env.REACT_APP_CLIENT_ID +
          "&client_secret=" +
          process.env.REACT_APP_CLIENT_SECRET,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      }
    );

    const data = await fetchAuth.json();
    token = data.token_type + " " + data.access_token;

    try {
      const pull = await fetch(
        "https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=" +
          input +
          "&page%5Blimit%5D=10&page%5Boffset%5D=0&sort=analytics.travelers.score&view=FULL",
        {
          headers: {
            Accept: "application/vnd.amadeus+json",
            Authorization: token,
          },
        }
      );
      const data = await pull.json();
      // console.log(data);
      autocompleteAPIValuesHold.options = data;
      console.log(data);

      setautocompleteOne(
        data.data[0].address.cityName + ", " + data.data[0].iataCode
      );
      setautocompleteTwo(
        data.data[1].address.cityName + ", " + data.data[1].iataCode
      );
      setautocompleteThree(
        data.data[2].address.cityName + ", " + data.data[2].iataCode
      );

      setautocompleteOneArrival(
        data.data[0].address.cityName + ", " + data.data[0].iataCode
      );
      setautocompleteTwoArrival(
        data.data[1].address.cityName + ", " + data.data[1].iataCode
      );
      setautocompleteThreeArrival(
        data.data[2].address.cityName + ", " + data.data[2].iataCode
      );
    } catch (err) {
    }
   
  };
  const hotelFlightSwitch = () => {
    sethotelOrFlight(!hotelOrFlight)
  }
  const selectTripType = (value) => {
    setRoundTrip(true);
  };
  const selectTripTypeOneWay = (value) => {
    setRoundTrip(false);
  };
  const updateSearchParams = (e) => {
    callCitySearchAPI(e.target.value);
    setDepartureLocation(e.target.value);
  };
  const updateArrivalParams = (e) => {
    callCitySearchAPI(e.target.value);
    setArrivalLocation(e.target.value);
  };
  const updateDatesAndFilters = (e, valueToUpdate) => {
    body[valueToUpdate] = e.target.value;
  };
   useEffect(() => {
    setArrivalMessage(arrivalMessage)
    });
  const x = async () => {
     setArrivalMessage("Where's your dddnext adventure " + localStorage.getItem('username') + "?")
  }
  return (
    <div>

       <Header  renderLogoutState={(e) => {setArrivalMessage('Arriving at...')}} />{" "}
      <div className="mainsearchwrap"> 
        <form className="flightsearchform">
          <section className="flighttypebtnwrap">
            <button
              type='button'
              className={
                roundTripSelected
                  ? "triptypebtnselected triptypebtnround"
                  : "triptypebtnround"
              }
         
              onClick={selectTripType}
            >
              Round-Trip
              <svg
                className="flighttypesvg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <title>chevron-down</title>
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </button>{" "}
            <button
            type='button'
              className={
                roundTripSelected
                  ? "triptypebtnone"
                  : "triptypebtnone triptypebtnselected"
              }
              onClick={selectTripTypeOneWay}
            >
              One-Way{" "}
              <svg
                className="flighttypesvg"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <title>chevron-down</title>
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </button>
            <button
            type='button'
            onClick={hotelFlightSwitch}
             className="flighthotelbtn">
              {hotelOrFlight ? (
                <svg
                  className="flighthotelsvg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>bed</title>
                  <path d="M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z" />
                </svg>
              ) : (
                <svg className="flighthotelsvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>airplane</title>
                  <path d="M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z" />
                </svg>
              )}
            </button>
          </section>
          <label className="locationinputswrap">

            <input
              autoComplete="off"
              list="locationslist"
              id="departure-location-complete"
              className="locationinputsarrival"
              required
              onChange={(e) => updateSearchParams(e, "departure")}
              placeholder="Departing From..."
            ></input>
           
            <datalist id="locationslist">
              <option
                onClick={() => console.log("YO")}
                value={autocompleteOne}
              ></option>
              <option value={autocompleteTwo}></option>
              <option value={autocompleteThree}></option>
            </datalist>
            <input
              autoComplete="off"
              list="arrivallist"
              id="arrival-location-complete"
              className="locationinputs"
              required
              onChange={(e) => updateArrivalParams(e, "arrival")}
              placeholder={arrivalMessage}
            ></input>
            <datalist id="arrivallist">
              <option
                value={autocompleteOneArrival}
              ></option>
              <option value={autocompleteTwoArrival}></option>
              <option value={autocompleteThreeArrival}></option>
            </datalist>
          </label>
          <section className="addOnsWrap">
            {roundTripSelected ? (
              <div className="dateselectionwrap">
                <CSSTransition
                  in={roundTripSelected}
                  timeout={420}
                  classNames="depdateFade"
                >
                  <input
                    className="depaturedateinput"
                    required
                    onChange={(e) => updateDatesAndFilters(e, "departureDate")}
                    type="date"
                    placeholder="MM/DD/YYYY"
                  ></input>
                </CSSTransition>
                <input
                  className="arrivaldateinput"
                  required
                  onChange={(e) => updateDatesAndFilters(e, "returnDate")}
                  type="date"
                ></input>
              </div>
            ) : (
              <label className="dateselectionwrap">
                <input
                  className="depaturedateinput"
                  required
                  onChange={(e) => updateDatesAndFilters(e, "departureDate")}
                  type="date"
                ></input>
              </label>
            )}
            <div className="refinesearchwrap">
              <button type='button' onClick={(e) => {setRefineSearchPopup(!refineSearchPopup)}} className="refinesearchbtn">Refine Search</button>
              <button className="travelersbtn"
              onClick={(e) => {setTravelersPopupdults(!travelersPopup)}}
              type='button'>
                <svg
                  className="personsvg"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>account-group</title>
                  <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z" />
                </svg>
                {adultCount} Adult {childCount} Children
              </button>
              {refineSearchPopup ? <RefineSearchPopup close={(e) => {setRefineSearchPopup(!refineSearchPopup)}} /> : null}
             {travelersPopup ? <TravelersPopup numAdults={(e) => {setAdultCount(travelerCounts.adults)}} 
             numChildren={(e) => {setChildCount(travelerCounts.children)}} close={(e) => {setTravelersPopupdults(!travelersPopup)}} /> : null } 
            </div>
          </section>
          <button className="searchBtn" onClick={flightQuery}>
            Submit
          </button>
        </form>
      </div>
      <section className="otheritemswrap">
        <div>
        <div className="adwraps">
          <p className="adslogans"><p>Find Your Paradise</p><a href="/register" className="booknowlink">Book Now</a></p>
        <img src={adPicOne}></img>
        </div>
        </div>
      </section>
      <p>Popular destinations <br></br>
     </p>
      <article>
        <RecommendedTab />
      </article>
      <span className="passangerselectwrap">
        <div className="maxpricewrap">
        </div>
      </span>
    </div>
  );
}
export default FlightSearchModal;
