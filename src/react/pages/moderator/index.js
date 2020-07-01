import React, { useEffect } from "react";
import { useSprings } from "react-spring";
import { useDrag } from "react-use-gesture";
import KeyboardEventHandler from "react-keyboard-event-handler";
import { isMobile } from "react-device-detect";
import Card from "./card";
import { useSetState, getCorrectParseFileUrl } from "../../helpers";

import "./style.css";

const preloadImages = async (urls = []) => {
  const promises = urls.map((url) => {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.src = url;

      img.onload = () => resolve();
      img.onerror = reject;
    });
  });

  return Promise.all(promises);
}

const to = () => ({
  x: 0,
  y: 0,
  opacity: 0,
  scale: 1,
  rot: -12 + Math.random() * 24,
  delay: undefined,
});

const from = () => ({
  x: 0,
  y: 0,
  opacity: 0,
  scale: 1,
  rot: 0,
  delay: undefined,
});

const trans = (r, s) => `perspective(2000px) rotateX(12deg) rotateY(${r / 12}deg) rotateZ(${r}deg) scale(${s})`;

const RenderCards = ({ cards, bind, data, isLoading }) => ((
  <div className={["cards", isLoading ? "hide" : "show"].join(" ")}>
    {
      cards.map(({ x, y, rot, scale, opacity }, i) => ((
        <Card
          key={i}
          i={i}
          x={x}
          y={y}
          rot={rot}
          opacity={opacity}
          scale={scale}
          trans={trans}
          data={data}
          bind={bind}
        />
      ))
      )
    }
  </div>
));

const Moderator = () => {
  // The set flags all the cards that are flicked out
  const [state, setState] = useSetState({
    loading: true,
    data: [],
    gone: new Set(),
    total: null,
  });

  // Create a bunch of springs using the helpers above
  const [props, set] = useSprings(state.data.length, i => ({
    ...to(i),
    from: from(i),
  }));

  useEffect(() => {
    getUserImages();

    window.addEventListener("visibilitychange", handleActivity);

    return () => {
      window.removeEventListener("visibilitychange", handleActivity);
    };
  }, []);

  // User has switched away from the tab (AKA tab is hidden)
  const handleActivity = (forcedFlag) => {
    if (typeof forcedFlag === 'boolean') {
      return forcedFlag && getUserImages();
    }

    return !document.hidden && getUserImages();
  };

  const handleKeys = (key) => {
    const dir = key === "d" ? -1 : key === "l" ? 1 : null;

    if (!dir || state.loading) return;

    const index = (state.data.length - 1) - state.gone.size;

    state.gone.add(index);

    set(i => {
      // We"re only interested in changing spring-data for the current spring
      if (index !== i) return;

      const x = (200 + window.innerWidth) * dir;
      // How much the card tilts, flicking it harder makes it rotate faster

      const rot = 10 + dir * 10;

      // Active cards lift up a bit
      const scale = 1.1;

      return {
        x,
        rot,
        scale,
        opacity: 1,
        delay: undefined,
        config: {
          friction: 50,
          tension: 70
        }
      }
    });

    saveParseData(index, dir === 1);
  }

  const getUserImages = async () => {
    await setState(state => {
      state.loading = true;
    });

    try {
      const query = new Parse.Query(collectionUserImage);
      query.limit(12);
      query.ascending("createdAt");
      query.equalTo("moderationRequired", true);
      const count = await query.count();
      const results = await query.find();

      await setState(state => {
        state.gone = new Set();
        state.data = results;
        state.total = count;
      });

      const images = results.map(r => getCorrectParseFileUrl(r.get("image").url()));

      await preloadImages(images);

      set(i => {
        return {
          x: 0,
          y: 0,
          opacity: 0,
          scale: 1,
          rot: -12 + Math.random() * 24,
          delay: undefined,
          config: {
            friction: 50,
            tension: 0
          }
        }
      });

      setTimeout(() => {
        setState(state => {
          state.loading = false;
        });
      }, 600);
    } catch (e) {
      console.error(e);
    }
  }

  const saveParseData = async (index, action) => {
    const id = state.data[index].id;
    try {
      const record = new collectionUserImage();
      record.id = id;
      record.set("moderationRequired", false);
      record.set("isSafe", action);

      await record.save();

      setState(state => {
        state.total = state.total - 1;
      });
    } catch (e) {
      console.error(e);
    }

    if (
      state.gone.size === state.data.length
    ) {
      getUserImages();
    }
  }

  const bind = useDrag(({ args: [index], down, movement: [mx, my], distance, direction: [xDir], velocity }) => {
    // If you flick hard enough it should trigger the card to fly out
    const trigger = velocity > 0.2;

    // Direction should either point left or right
    const dir = xDir < 0 ? -1 : 1;

    // If button/finger"s up and trigger velocity is reached, we flag the card ready to fly out
    if (!down && trigger) {
      state.gone.add(index);
      saveParseData(index, dir === 1);
    }


    set(i => {
      // We"re only interested in changing spring-data for the current spring
      if (index !== i) return;


      const isGone = state.gone.has(index);
      // When a card is gone it flys out left or right, otherwise goes back to zero
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;

      // How much the card tilts, flicking it harder makes it rotate faster
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0);

      // Active cards lift up a bit
      const scale = down ? 1.1 : 1;

      const opacity = x === 0 ? 0 : (distance <= 100 ? (distance / 100) : 1);

      return {
        x,
        rot,
        scale,
        opacity: opacity.toFixed(2),
        delay: undefined,
        config: {
          friction: 50,
          tension: down ? 1000 : isGone ? 200 : 500
        }
      }
    });
  });

  const logOutHandler = (e) => {
    e.preventDefault();

    Parse.User.logOut();
    location.reload();
  }

  return (
    <>
      <KeyboardEventHandler
        handleKeys={["d", "l"]}
        onKeyEvent={handleKeys} />
      <div className="header">
        <div className="headerHolder">
          {
            isMobile ? (
              <a href="https://github.com/SashiDo/content-moderation-application" className="github" target="_blank">
                <svg height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <path fill="#fff" d="M296.133,354.174c49.885-5.891,102.942-24.029,102.942-110.192 c0-24.49-8.624-44.448-22.67-59.869c2.266-5.89,9.515-28.114-2.734-58.947c0,0-18.139-5.898-60.759,22.669   c-18.139-4.983-38.09-8.163-56.682-8.163c-19.053,0-39.011,3.18-56.697,8.163c-43.082-28.567-61.22-22.669-61.22-22.669   c-12.241,30.833-4.983,53.057-2.718,58.947c-14.061,15.42-22.677,35.379-22.677,59.869c0,86.163,53.057,104.301,102.942,110.192   c-6.344,5.452-12.241,15.873-14.507,30.387c-12.702,5.438-45.808,15.873-65.758-18.592c0,0-11.795-21.31-34.012-22.669   c0,0-22.224-0.453-1.813,13.592c0,0,14.96,6.812,24.943,32.653c0,0,13.6,43.089,76.179,29.48v38.543   c0,5.906-4.53,12.702-15.865,10.89C96.139,438.977,32.2,354.626,32.2,255.77c0-123.807,100.216-224.022,224.03-224.022   c123.347,0,224.023,100.216,223.57,224.022c0,98.856-63.946,182.754-152.828,212.688c-11.342,2.266-15.873-4.53-15.873-10.89   V395.45C311.1,374.577,304.288,360.985,296.133,354.174L296.133,354.174z M512,256.23C512,114.73,397.263,0,256.23,0   C114.73,0,0,114.73,0,256.23C0,397.263,114.73,512,256.23,512C397.263,512,512,397.263,512,256.23L512,256.23z" />
                  </g>
                </svg>
              </a>
            ) : <span />
          }
          <a href="/moderator" className="refresh"><h3>Not Safe for Work Admin</h3></a>
          <a href="/moderator" className="logout" onClick={logOutHandler}><i className="icofont-logout"></i></a>
        </div>
      </div>

      <div className="allDoneMessage" style={{ opacity: state.total === 0 ? 1 : 0 }}>
        All Done! :)
      </div>

      <div className="loading" style={{ opacity: state.loading ? 1 : 0 }} />

      <RenderCards cards={props} bind={bind} data={state.data} isLoading={state.loading} />

      <div className="controls" style={{ opacity: state.total > 0 ? 1 : 0 }}>
        <div className="button" onClick={() => handleKeys("d")}><i className="icon reject icofont-close-circled" /></div>
        <div className="count">{state.total} images left</div>
        <div className="button" onClick={() => handleKeys("l")}><i className="icon accept icofont-check-circled" /></div>
      </div>
    </>
  );
}

export default Moderator;
