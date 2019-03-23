import React, { useState, useCallback } from "react";
import Link from "next/link";
import Page from "../components/Page";
import { endpoint } from "../util";
export default () => {
  const [name, setName] = useState("");
  const [sentSaveTheDate, setSentSaveTheDate] = useState(false);
  const [sentInvitations, setSentInvitations] = useState(false);
  const [rsvp, setRsvp] = useState(false);
  const invite = useCallback(() => {
    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        query: `mutation createGuest($name: String!, $sentInvitation: Boolean, $sentSaveTheDate: Boolean, $rsvp: Boolean) {
                  insert_wedding_guests(objects: [{name: $name, sent_invitation: $sentInvitation, sent_save_the_date: $sentSaveTheDate, rsvp: $rsvp}]) {
                    affected_rows
                  }
                }
                `,
        variables: {
          name,
          sentInvitation: sentInvitations,
          sentSaveTheDate,
          rsvp,
        },
      }),
    }).then(response => (window.location.href = "/"));
  }, [name, sentInvitations, sentSaveTheDate, rsvp]);
  return (
    <Page>
      <form
        onSubmit={e => {
          e.preventDefault();
          invite();
        }}
      >
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="input"
              type="text"
              placeholder="John Doe"
            />
          </div>
        </div>
        <div className="field">
          <label className="checkbox">
            <input checked={sentSaveTheDate} onChange={e => setSentSaveTheDate(!sentSaveTheDate)} type="checkbox" />{" "}
            Sent Save the Date
          </label>
        </div>
        <div className="field">
          <label className="checkbox">
            <input checked={sentInvitations} onChange={e => setSentInvitations(!sentInvitations)} type="checkbox" />{" "}
            Sent Invitation
          </label>
        </div>
        <div className="field">
          <label className="checkbox">
            <input checked={rsvp} onChange={e => setRsvp(!rsvp)} type="checkbox" /> RSVP
          </label>
        </div>
        <div className="field">
          <input className="button is-primary" type="submit" value="Save" />{" "}
          <Link href="/">
            <button className="button">Cancel</button>
          </Link>
        </div>
      </form>
    </Page>
  );
};
