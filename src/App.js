import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [musicRecordLabelData, setMusicRecordLabelData] = useState([]);
  
  useEffect(() => {
    const fetchMusicFestivalData = async () => {
      const response = await axios.get('https://ru4abozotc.execute-api.ap-southeast-2.amazonaws.com/dev/api/v1/festivals');
      let recordLabelRawData= [];
      let recordLabelData = [];
      response.data.map((festival) =>
        festival.bands.map (band => 
          recordLabelRawData.push({
            name: band.recordLabel,
            band: band.name,
            festival: festival.name
          })
        )
      )
      const recordLabelSet = Array.from(new Set(recordLabelRawData.map(r => r.name))).sort();
      const bandSet = Array.from(new Set(recordLabelRawData.map(r => r.band))).sort();
  
      recordLabelSet.map((rl, rlk) => {
        let recordLabelBandRawData = [];
        recordLabelRawData.map(rlr => {
          if (rlr.name === rl) {
            recordLabelData[rlk] = {
              name: rl,
              bands: [],
            }
            recordLabelBandRawData.push(
              {
                name: rlr.band,
                festival: rlr.festival,
              }
            );
            let bandCount = -1;
            bandSet.map((b, bk) => {
              let recordLabelBandFestRawData = [];
              recordLabelBandRawData.map(rlrb => {
                if (rlrb.name === b) {
                  recordLabelBandFestRawData.push(rlrb.festival);
                }
                return rlrb;
              });
              if (recordLabelBandFestRawData.length !== 0) {
                bandCount += 1;
                recordLabelData[rlk].bands[bandCount] = {
                  name: b,
                  festival: Array.from(new Set(recordLabelBandFestRawData)).sort()
                }
              }
              return b;
            });
          }
          return rlr;
        });
        return rl;
      })
      setMusicRecordLabelData(recordLabelData);
    }
    fetchMusicFestivalData();
  }, []);

  return (
    <div className="container">
      <h1>Music Festival Panel</h1>
      <div>
        {
          musicRecordLabelData && musicRecordLabelData.map(rl => 
            (<div>
              <h2>{rl.name}</h2>
              {
                rl.bands.map(rlb => (<div>
                  <h3>{rlb.name}</h3>
                  <div>
                    {rlb.festival.map(festivalName => (
                      <h4>{festivalName}</h4>
                    ))}
                  </div>
                </div>))
              }
            </div>)
          )
        }
      </div>
    </div>
  );
}

export default App;
