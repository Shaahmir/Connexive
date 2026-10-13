import '../styles/HistoryPage.css';
import CloseIcon from '../assets/svg/home-svgs/close.svg'

export default function HistoryComponent({historyTab, setHistoryTab, data}) {

  const formatDate = (date) => {
    const [d, t] = date.split("T");
    return d;
  }

  const formatTime = (date) => {
    const [d, t] = date.split("T");
    const time = t.split(".")[0];
    return time;
  }

  const formatMeetingId = (meetingId) => {
    const part1 = meetingId.slice(0,3); 
    const part2 = meetingId.slice(3);
    return `${part1}-${part2}`;
  }
  
  return (

    <div className='history-tab'>
        <div className="history-container">

        <span>
          <img src={CloseIcon} onClick={() => setHistoryTab(!historyTab)}  />
          <h1>History:</h1>
        </span>

        <section>
          {
             data.length == 0 ?
            <div className='no-history-div'><h3>You have no History currently!</h3></div>
            : 
            null
          }
            {
              data.map((el, idx) => (
                <div key={idx}>
                  <p><span>Username: </span>{el.userId}</p>
                  <p><span>Meeting Id:</span> {formatMeetingId(el.meetingId)}</p>
                  <p><span>Date: </span>{formatDate(el.date)}</p>
                  <p><span>Time: </span>{formatTime(el.date)}</p>
                </div>
              ))
            }
            
        </section>
      </div>
    </div>
  );
}
