import React from "react";
import { animated, to as interpolate } from "react-spring";
import { isMobile } from "react-device-detect";
import { getCorrectParseFileUrl } from "../../helpers";

const Predictions = ({ data = [], imageAuthor = "" }) => {
  return (
    <div className="imageInfo">
      <div className="predictions">
        {
          data.map((item) => {
            const probabilityPercentage = item.probability * 100;
            const width = probabilityPercentage <= 4 ? 4 : probabilityPercentage;
            return (
              <div key={item.className} className="predictionsRow">
                <div>{item.className}</div>
                <div>
                  <span className="progress" style={{ width: `${width}%` }} />
                </div>
              </div>
            )
          })
        }
      </div>
      <div className="copy">{imageAuthor}</div>
    </div>
  );
};

const Card = ({ i, x, y, rot, scale, opacity, trans, bind, data }) => {
  const imageUrl = getCorrectParseFileUrl(data[i].get("image").url());
  const NSFWPredictions = data[i].get("NSFWPredictions");
  const imageAuthor = data[i].get("imageAuthor");
  const filteredNSFWPredictions = NSFWPredictions
    .filter(f => !(["Neutral", "Drawing"].includes(f.className)))
    .sort((a, b) => a.className.localeCompare(b.className)).reverse();

  return (
    <animated.div
      className="card"
      key={i}
      style={{
        transform: interpolate([x, y], (x, y) => `translate3d(${x}px, ${y}px,0)`)
      }}
    >
      <animated.div
        {...bind(i)}
        style={{
          transform: interpolate([rot, scale], trans)
        }}
      >
        <animated.div
          className="gradientMask"
          style={{
            opacity: opacity && interpolate([x, opacity], (x, opacity) => x < 0 && opacity),
            background: interpolate([x], (x) => x < 0 && `linear-gradient(-145deg, #fd008f 0%, transparent 70%, transparent 100%)`),
          }}
        >
          <i className="icon reject icofont-close-circled"></i>
        </animated.div>
        <animated.div
          className="gradientMask"
          style={{
            opacity: opacity && interpolate([x, opacity], (x, opacity) => x > 0 && opacity),
            background: interpolate([x], (x) => x > 0 && `linear-gradient(145deg, #4bd58d 0%, transparent 70%, transparent 100%)`),
          }}
        >
          <i className="icon accept icofont-check-circled"></i>
        </animated.div>
        <div className="img" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: isMobile ? "cover" : "contain" }} />
        <Predictions data={filteredNSFWPredictions} imageAuthor={imageAuthor} />
      </animated.div>
    </animated.div>
  );
};

export default Card;
