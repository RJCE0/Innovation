import React, { useEffect, useState } from "react";
import styled from "styled-components";
import S3FileUpload from "react-s3";
import { DiscoverNavbar } from "../../../components/discover/DiscoverNavbar";
import Footer from "../../../components/layout/Footer";
import { withRouter } from "react-router";
import axios from "axios";
import { BusinessSideNavOptions, config } from "../../../constants";
import Input from "../../../components/common/Input";
import Select from "react-select";
import { filterOptions } from "../../../components/discover/ModalElements";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const InputFile = styled.input`
  padding: 10px 0px;
`;

const options = [
  { label: "Any", value: 0, key: 0 },
  { label: "London", value: 1, key: 1 },
  { label: "Amsterdam", value: 2, key: 2 },
];

class ApplyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      location: null,
      summary: "",
      pay: "",
      role: "",
      skills_gained: "",
      requirements: "",
      c_description: "",
      image: null,
      image_url: "",
      start_date: null,
      posted: false,
    };
    this.locations = [];
  }

  async getlocations() {
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
  }

  // Uploads file and returns link to file
  async aws_upload(file) {
    const configs = {
      bucketName: "innovation-drp-bucket",
      dirName: "logo",
      region: "eu-west-2",
      accessKeyId: "AKIAYSN3QHAZOZLZ7XNB",
      secretAccessKey: "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",
    };

    var result = {};

    await S3FileUpload.uploadFile(file, configs)
      .then((data) => {
        result = data;
      })
      .catch((err) => console.error(err));

    return result.location;
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState(
      { image_url: await this.aws_upload(this.state.image), posted: true },
      async () => {
        await axios
          .post(`${config.API_URL}/create`, {
            params: {
              body: this.state,
            },
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  };

  onChangeLocation = (e) => {
    this.setState(() => {
      return { location: e.label };
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeFile = async (e) => {
    this.setState({ [e.target.name]: e.target.files[0] });
  };

  async componentDidMount() {
    const locationList = await this.getlocations();
    for (let i in locationList) {
      locationList[i] = { label: locationList[i], value: i + 1, key: i + 1 };
    }
    this.locations = locationList;
    this.forceUpdate();
  }

  onChangeStartDate = (date) => {
    this.setState(() => {
      date.setHours(3);
      return { start_date: date };
    });
  };

  render() {
    return (
      <>
        <DiscoverNavbar links={BusinessSideNavOptions} business />
        <form
          className="cardContainer lght-shad"
          id="signup-container"
          onSubmit={this.onSubmit}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span className="signupHeader">Create Internship Post</span>
          </div>
          <Input
            placeholder="Enter a title for the opportunity"
            name="title"
            value={this.state.title}
            onChange={this.onChange}
            styles={{
              padding: "10px 12px",
              borderRadius: "4px",
              color: "#000000",
              border: "2px solid #717171",
              marginBottom: "10px",
            }}
          />

          <Input
            placeholder="Summary (100 characters max)"
            name="summary"
            value={this.state.summary}
            onChange={this.onChange}
            styles={{
              padding: "10px 12px",
              borderRadius: "4px",
              color: "#000000",
              border: "2px solid #717171",
              marginBottom: "10px",
              height: 150,
              width: "100%",
              height: "35vh",
              backgroundColor: "#f3f3f3",
              boxSizing: "border-box",
              outline: "none",
              fontWeight: "bolder",
              fontSize: 18,
            }}
            area
            maxLength="100"
          />
          <Input
            placeholder="What does the role involve? (1500 characters max)"
            name="role"
            value={this.state.role}
            onChange={this.onChange}
            styles={{
              padding: "10px 12px",
              borderRadius: "4px",
              color: "#000000",
              border: "2px solid #717171",
              marginBottom: "10px",
              height: 150,
              width: "100%",
              height: "35vh",
              backgroundColor: "#f3f3f3",
              boxSizing: "border-box",
              outline: "none",
              fontWeight: "bolder",
              fontSize: 18,
            }}
            area
            maxLength="1500"
          />
          <Input
            placeholder="Skills Gained (1500 characters max)"
            name="skills_gained"
            value={this.state.skills_gained}
            onChange={this.onChange}
            styles={{
              padding: "10px 12px",
              borderRadius: "4px",
              color: "#000000",
              border: "2px solid #717171",
              marginBottom: "10px",
              height: 150,
              width: "100%",
              height: "35vh",
              backgroundColor: "#f3f3f3",
              boxSizing: "border-box",
              outline: "none",
              fontWeight: "bolder",
              fontSize: 18,
            }}
            area
            maxLength="1500"
          />
          <Input
            placeholder="Enter Company Description"
            name="c_description"
            value={this.state.c_description}
            onChange={this.onChange}
            styles={{
              padding: "10px 12px",
              borderRadius: "4px",
              color: "#000000",
              border: "2px solid #717171",
              marginBottom: "10px",
              height: 150,
              width: "100%",
              height: "35vh",
              backgroundColor: "#f3f3f3",
              boxSizing: "border-box",
              outline: "none",
              fontWeight: "bolder",
              fontSize: 18,
            }}
            area
            maxLength="1500"
          />
          <Input
            placeholder="Requirements (1500 characters max)"
            name="requirements"
            value={this.state.requirements}
            onChange={this.onChange}
            styles={{
              padding: "10px 12px",
              borderRadius: "4px",
              color: "#000000",
              border: "2px solid #717171",
              marginBottom: "10px",
              height: 150,
              width: "100%",
              height: "35vh",
              backgroundColor: "#f3f3f3",
              boxSizing: "border-box",
              outline: "none",
              fontWeight: "bolder",
              fontSize: 18,
            }}
            area
            maxLength="1500"
          />
          <Input
            placeholder="Pay per week (£)"
            name="pay"
            value={this.state.pay}
            onChange={this.onChange}
            styles={{
              padding: "10px 12px",
              borderRadius: "4px",
              color: "#000000",
              border: "2px solid #717171",
              marginBottom: "10px",
              width: "100%",
              backgroundColor: "#f3f3f3",
              boxSizing: "border-box",
              outline: "none",
              fontWeight: "bolder",
              fontSize: 18,
            }}
          />
          <div
            style={{
              display: "flex",
              padding: "10px 0px",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <label htmlFor="location" style={{ width: "50%" }}>
              <Select
                id="location"
                name="location"
                onChange={this.onChangeLocation}
                defaultValue={{ label: "Select Location", value: 0 }}
                filterOptions={filterOptions(this.locations)}
                options={this.locations}
              />
            </label>
            <div
              style={{
                display: "flex",
                width: "50%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DatePicker
                id="start"
                selected={this.state.start_date}
                onChange={(date) => this.onChangeStartDate(date)}
                showYearDropdown
                scrollableYearDropdown
                todayButton="Today"
                placeholderText=" Select starting date"
                dateFormat="dd/MM/yyyy"
                isClearable={true}
                minDate={new Date()}
              />
            </div>
          </div>
          <label
            htmlFor="myFile"
            style={{ width: "100%", marginBottom: "10px" }}
          >
            Upload Logo:{"\t"}
            <InputFile
              type="file"
              id="myFile"
              onChange={this.onChangeFile}
              name="image"
            />
          </label>
          <button
            style={{ width: "100%" }}
            type="Submit"
            className="btn flat-btn fill-btn"
            disabled={this.state.posted}
          >
            {this.state.posted ? "Posted!" : "Post Opportunity"}
          </button>
        </form>
        <Footer />
      </>
    );
  }
}

export default withRouter(ApplyPage);
