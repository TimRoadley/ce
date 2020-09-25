import React from "react";
import "./styles/home.css";

export default class Loot extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <div>
          <h1>Loot Rules</h1>
          <ul>
            <li>
              Starting with AQ40 our loot system is <strong>EP/GP</strong>, so
              raiders must install the{" "}
              <a href="https://www.curseforge.com/wow/addons/cepgp">CEPGP</a>{" "}
              addon to request loot.
            </li>
          </ul>
          <h1>EP/GP</h1>
          <ul>
            <li>
              EP/GP means <strong className="common">Effort Points</strong>{" "}
              divided by <strong className="epic">Gear Points</strong>, which is
              used to determine a{" "}
              <strong className="artifact">Loot Priority</strong>.
            </li>
            <li>
              <strong className="common">Effort Points</strong> are awarded:
              <ul>
                <li>for killing 40 man bosses in guild raids.</li>
                <li>ad hoc for 40 man progression on bosses in guild raids.</li>
                <li>
                  for being benched by the raid leader (and remaining
                  contactable) during guild raids.
                </li>
              </ul>
            </li>
            <li>
              <strong className="epic">Gear Points</strong> are assigned:
              <ul>
                <li>when you receive loot from AQ40 or Naxx.</li>
                <li>based on the value of the item received.</li>
              </ul>
            </li>
            <li>
              <strong className="artifact">Loot Priority</strong> is determined
              by comparing everyone's{" "}
              <strong className="common">Effort Points</strong> versus{" "}
              <strong className="epic">Gear Points</strong>, so the person with
              the highest priority can take the loot if they want it.
            </li>
            <li>All points decay by 10% per week to prevent hoarding.</li>
            <li>
              Gear Points are set at a minimum of 100 to prevent errors dividing
              by zero.
            </li>
          </ul>
          <h1>EP/GP Example</h1>
          <ul>
            <li>
              An item drops, the master looter broadcasts with the{" "}
              <a href="https://www.curseforge.com/wow/addons/cepgp">CEPGP</a>{" "}
              addon.
            </li>
            <li>Click the button to indicate that you want this item.</li>
            <li>
              If your <strong className="artifact">Loot Priority</strong> is the
              highest, you'll receive the item and a{" "}
              <strong className="epic">Gear Points</strong> increase.
            </li>
          </ul>
          <h1>Alts</h1>
          <ul>
            <li>
              Level 60 reasonably geared alts are allowed in Onyxia and MC.
            </li>
            <li>
              If your alt is not linked to your main it won't earn{" "}
              <strong className="common">Effort Points</strong>.
            </li>
          </ul>
          <h1>Reserved Items</h1>
          <ul>
            <li>
              <strong className="rare">AQ40 Idols and Scarabs</strong> are sent
              to <strong className="common">catbank</strong>, then provided
              for free to raiders to{" "}
              <a href="https://classic.wowhead.com/guides/temple-ahnqiraj-aq40-tier-25-classic-wow">
                create sets
              </a>. For the first 3 weeks of AQ40, scarabs/idols will be given for 2.5 only.
            </li>
            <li>
              <strong className="legendary">Garr Left Binding</strong> is an
              open roll, for someone committed to Thuderfury.
            </li>
            <li>
              <strong className="legendary">Garr Right Binding</strong> is an
              open roll, for someone committed to Thuderfury.
            </li>
            <li>
              <strong className="legendary">Eye of Sulfuras</strong> is an open
              roll, for someone committed to Hand of Rag.
            </li>
            <li>
              <strong className="legendary">Atiesh</strong> is reserved for
              Agiel.
            </li>
          </ul>
          <h1>Other Stuff</h1>
          <ul>
            <li>Please see <a href="https://www.catalyst-elite.org/bench">here</a> for the bench rules</li>
            <li>Raiders &gt; Members &gt; Trials for 40-man loot.</li>
            <li>Trials become Raiders after 2 weeks provided class leader approves.</li>
            <li>BWL/MC/Ony are open rolls, not EP/GP.</li>
            <li>Only mains can come to BWL and AQ40.</li>
            <li>Mains or alts can come to MC / Ony, however MC is now removed from our main raid nights.</li>
          </ul>
        </div>
      </div>
    );
  }
}