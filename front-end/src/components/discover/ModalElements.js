import React, { useEffect, useCallback, useState } from "react";
import { useSpring, animated } from "react-spring";
import axios from "axios";
import { config } from "../../constants";
import styled from "styled-components";
import { MdClose } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import createFilterOptions from "react-select-fast-filter-options";
import Select from "react-select";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { Button } from "react-bootstrap";
import "react-toggle/style.css";
import Toggle from "react-toggle";

const ModalBackground = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  top: 0;
  left: 0;
  font-family: "Nunito", sans-serif;
`;

const ModalWrapper = styled.div`
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 110;
  border-radius: 10px;
  padding: 20px 30px 60px 30px;
  max-height: 90vh;
  overflow-y: scroll;
`;

const CloseModalDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  width: 35px;
  height: 35px;
  z-index: 110;

  &:active {
    border: 3px rgba(27, 119, 223, 0.4) solid;
    border-radius: 10px;
  }
`;

const Extras = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1.5fr;
  grid-row-gap: 50px;
  grid-column-gap: 70px;
  margin-left: 50px;
  margin-right: 50px;

  @media screen and (max-width: 700px) {
    grid-template-columns: 1.5fr;
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

const Slide = withStyles({
  root: {
    color: "#3b86e7",
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,

    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const locations = async () => {
  var result = [];
  await axios
    .get(`${config.API_URL}/locations`)
    .then((res) => {
      const location = res.data;
      result = location;
    })
    .catch((error) => {
      console.log(error);
    });
  return result.length ? result.split("\n") : [];
};

const optionsDatePosted = [
  { label: "Any", value: 0, key: 0 },
  { label: "Today", value: 1, key: 1 },
  { label: "This Week", value: 2, key: 2 },
  { label: "This Month", value: 3, key: 3 },
  { label: "This Year", value: 4, key: 4 },
];

export const filterOptions = (options) => {
  createFilterOptions({
    options,
  });
};

const marks = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 30,
    label: "30+",
  },
];

const marksPay = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 200,
    label: "200",
  },
  {
    value: 400,
    label: "400",
  },
  {
    value: 600,
    label: "600",
  },
  {
    value: 800,
    label: "800",
  },
  {
    value: 1000,
    label: "1000+",
  },
];

export const FilterModal = ({
  show,
  showModal,
  onChangeFullRemote,
  onChangeLocation,
  onChangeDatePosted,
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  handleSubmit,
  fullRemote,
  selectLocation,
  selectPostedDate,
  onChangeDistance,
  onChangeMinPay,
  distance,
  minPay,
  exclusiveFilter,
  onChangeExclusiveFilter,
}) => {
  const classes = useStyles();

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: show ? 1 : 0,
    transform: show ? `translateY(0%)` : `translateY(-100%)`,
  });

  const escapePress = useCallback(
    (e) => {
      if (show && e.key === "Escape") {
        showModal();
      }
    },
    [showModal, show]
  );

  useEffect(() => {
    document.addEventListener("keydown", escapePress);
    return () => document.removeEventListener("keydown", escapePress);
  }, [escapePress]);

  const [optionsLocation, setOptionsLocation] = useState(null);
  useEffect(async () => {
    const something = await locations();
    for (let i in something) {
      something[i] = { label: something[i], value: i + 1, key: i + 1 };
    }
    something.unshift(optionsDatePosted[0]);
    setOptionsLocation(something);
  }, []);

  return (
    <>
      {show ? (
        <ModalBackground>
          <animated.div style={animation}>
            <ModalWrapper show={show}>
              <CloseModalDiv>
                <CloseModalButton onClick={() => showModal()} />
              </CloseModalDiv>
              <Extras>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    gap: "10px",
                  }}
                >
                  <label htmlFor="remote">
                    <h3>Remote?</h3>
                  </label>
                  <Toggle
                    id="remote"
                    defaultChecked={fullRemote}
                    onChange={onChangeFullRemote}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    gap: "10px",
                  }}
                >
                  <label htmlFor="exclusive">
                    <h3>Exclusive?</h3>
                  </label>
                  <Toggle
                    id="exclusive"
                    defaultChecked={exclusiveFilter}
                    onChange={onChangeExclusiveFilter}
                  />
                </div>
                <div>
                  <h3 style={{ textAlign: "center" }}>Location</h3>
                  <Select
                    onChange={onChangeLocation}
                    defaultValue={
                      selectLocation
                        ? { label: selectLocation }
                        : optionsLocation[0]
                    }
                    filterOptions={filterOptions(
                      optionsLocation ? optionsLocation : []
                    )}
                    options={optionsLocation ? optionsLocation : []}
                  />
                </div>
                <div>
                  <h3 style={{ textAlign: "center" }}>Date Posted</h3>
                  <Select
                    onChange={onChangeDatePosted}
                    defaultValue={
                      selectPostedDate
                        ? { label: selectPostedDate }
                        : optionsDatePosted[0]
                    }
                    filterOptions={filterOptions(optionsDatePosted)}
                    options={optionsDatePosted}
                  />
                </div>
                <div>
                  <h3 style={{ textAlign: "center" }}>Starts After</h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => onChangeStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      showYearDropdown
                      scrollableYearDropdown
                      todayButton="Today"
                      placeholderText=" Select starting date"
                      dateFormat="dd/MM/yyyy"
                      isClearable={true}
                    />
                  </div>
                </div>
                <div>
                  <h3 style={{ textAlign: "center" }}>Starts Before</h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => onChangeEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      showYearDropdown
                      scrollableYearDropdown
                      todayButton="Today"
                      placeholderText=" Select ending date"
                      dateFormat="dd/MM/yyyy"
                      isClearable={true}
                    />
                  </div>
                </div>
                <div>
                  <h3 style={{ textAlign: "center" }}>Minimum Pay (£)</h3>
                  <Slide
                    defaultValue={minPay ? minPay : 0}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={100}
                    marks={marksPay}
                    min={0}
                    max={1000}
                    onChangeCommitted={onChangeMinPay}
                  />
                </div>
                <div>
                  <h3 style={{ textAlign: "center" }}>Distance (miles)</h3>
                  <Slide
                    defaultValue={distance ? distance : 0}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={10}
                    marks={marks}
                    min={0}
                    max={30}
                    onChangeCommitted={onChangeDistance}
                  />
                </div>
              </Extras>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: "10px",
                }}
              >
                <Button onClick={handleSubmit} variant="primary">
                  {" "}
                  Apply Filters{" "}
                </Button>
              </div>
            </ModalWrapper>
          </animated.div>
        </ModalBackground>
      ) : null}
    </>
  );
};
