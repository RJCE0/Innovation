import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { config } from "../../constants";
import EmptyHeartImg from "../../img/empty-heart.svg";
import FilledInHeartImg from "../../img/filled-heart.svg";
import ShareImg from "../../img/share.svg";
import ShareModal from "./ShareModal";

const CardElements = (opp) => (
  <div className="cardContainer contentBox lght-shad">
    <div className="content-type-placeholder-img">
      <img className="content-type-img" src={opp.image_url} />
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 160">
        <g id="Layer_2" data-name="Layer 2">
          <path
            id="Layer_3"
            fill="#f3f3f3"
            d="M0 0h280v160H0z"
            data-name="Layer 3"
          />
          <g id="Layer_4" data-name="Layer 4">
            <path
              style={{ fill: "#7a7a7a", opacity: opp.image_url ? 0 : 0.4 }}
              d="M181.3 53.1v66.68c-4.49.35-9 .45-13.46 1.13s-4.72.82-4.72-3.79V80.76c0-1.31.78-3.22-1.76-3.4-2.74-.19-5.48-.44-8.21-.79-3.31-.42-4.57.6-4.49 4.24.25 11.74.09 23.48.09 35.22 0 5.88 0 5.88-5.57 7-.19 0-.33.35-.49.53h-12.92V48.49c1.4-1.28 3.08-.73 4.62-.57 9.13.91 18.25 1.9 27.36 2.9 6.52.73 13.03 1.52 19.55 2.28z"
              opacity=".12"
            />
            <path
              style={{ fill: "#7a7a7a", opacity: opp.image_url ? 0 : 1 }}
              d="M128.25 123.57c-3-1.94-6.7-2-10-3.42-1.39-.58-2.22-.89-2.21-2.72q.12-31 0-62a2.75 2.75 0 0 1 2.15-3c3.83-1.36 7.69-2.63 11.53-3.93v75.07zM98.7 59.16c5-.61 9.3-3.29 14.4-4.13v61c0 1.81-.2 2.33-2.28 1.64-4-1.32-8.08-2.14-12.14-3.17zM113.1 36.43c-.06 3.87-.19 7.75-.16 11.62 0 2.09-.23 3.35-2.9 3.7-3.84.52-7.41 2.46-11.34 2.86V41c3.32-2 7.55-1.92 10.61-4.54z"
              className="cls-3"
            />
          </g>
        </g>
      </svg>
    </div>
    <div className="content-type-overlay">
      <div className="content-bottom-gradient" />
      {opp.exclusive && <span className="content-special excl">Exclusive</span>}

      <span className="content-view">{opp.views} Views</span>
    </div>
  </div>
);

class OpportunityPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showShare: false,
      copy: false,
      favClicked: this.props.fav,
      views: parseInt(this.props.views),
      show: false,
    };
    this.handleShareClose = this.handleShareClose.bind(this);
    this.handleShareShow = this.handleShareShow.bind(this);
    this.handleFavClicked = this.handleFavClicked.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.setCopy = this.setCopy.bind(this);
  }

  handleShareClose() {
    this.setState(() => {
      return { copy: false, showShare: false };
    });
  }

  handleShareShow() {
    this.setState(() => {
      return { showShare: true };
    });
  }

  handleFavClicked() {
    this.setState(({ favClicked }) => {
      return { favClicked: !favClicked };
    }, this.updateFavourites.bind(this));
  }

  handleClose() {
    this.setState(() => {
      return { show: false };
    });
  }

  async handleShow() {
    this.setState(({ views }) => {
      return { show: true, views: views + 1 };
    }, this.updateViews.bind(this));
  }

  setCopy(newCopy) {
    this.setState(() => {
      return { copy: newCopy };
    });
  }

  async updateFavourites() {
    await axios
      .post(`${config.API_URL}/favourites`, {
        params: {
          body: { ...this.props, fav: this.state.favClicked },
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async updateViews() {
    await axios
      .post(`${config.API_URL}/views`, {
        params: {
          body: { ...this.props, views: this.state.views },
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const undisclosedPay = -1;
    const unpaidOpportunity = 0;
    const opp = this.props;
    const payStatement =
      opp.pay == unpaidOpportunity
        ? "Unpaid opportunity"
        : "£" + opp.pay + "p/w";
    return (
      <>
        <div className="content-item" data-id={opp.id}>
          {opp.exclusive ? (
            <Link
              to={{
                pathname: `/discover/${opp.title
                  .trim()
                  .replace(/\s+/g, "-")
                  .toLowerCase()}&id=${opp.id}`,
              }}
            >
              <CardElements {...opp} views={this.state.views} />
            </Link>
          ) : (
            <a onClick={this.handleShow}>
              <CardElements {...opp} views={this.state.views} />
            </a>
          )}
          <div className="content-top-leftContainer">
            <button onClick={this.handleFavClicked} className="content-btn">
              <img
                width="25px"
                height="25px"
                src={this.state.favClicked ? FilledInHeartImg : EmptyHeartImg}
              />
            </button>
            <button className="content-btn" onClick={this.handleShareShow}>
              <img width="25px" height="25px" src={ShareImg} />
            </button>
          </div>
          <div className="content-info">
            <a className="title" onClick={this.handleShow}>
              {opp.title.length > 26
                ? opp.title.substring(0, 23).trim() + "..."
                : opp.title}
            </a>
            <span className="additional-info">
              {opp.date == null
                ? "Starting Date TBC"
                : `Starts: ${new Date(opp.date).toDateString()}`}
            </span>
          </div>
        </div>
        <ShareModal
          handleShareClose={this.handleShareClose}
          showShare={this.state.showShare}
          opportunity={opp}
          copy={this.state.copy}
          setCopy={this.setCopy}
        />
        <Modal
          className="opportunity-page-modal"
          show={this.state.show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <div>
              <Modal.Title>
                <h3>{opp.title}</h3>
              </Modal.Title>
              {opp.location}
            </div>
          </Modal.Header>
          <Modal.Body>
            {" "}
            <p>{opp.description}</p>
            <h5>{this.state.views} views </h5>
            <h5>
              {" "}
              Pay: {opp.pay == undisclosedPay
                ? "Competitive"
                : payStatement}{" "}
            </h5>
            <h5>
              Start Date:{" "}
              {opp.date == null
                ? "Undisclosed"
                : new Date(opp.date).toDateString()}
            </h5>
            <h5>
              Date Posted:{" "}
              {new Date(opp.date_posted).toLocaleDateString("en-GB")}
            </h5>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" href={opp.link} target="_blank">
              {" "}
              Learn more!{" "}
            </Button>
            <Button variant="warning" onClick={this.handleFavClicked}>
              {" "}
              {this.state.favClicked
                ? "Remove from Favourites"
                : "Add to Favourites"}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default OpportunityPage;
