import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { endpoint } from "../util";
import Page from "../components/Page";

export default () => {
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().getTime());
  useEffect(() => {
    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        query: `{
                    wedding_guests(order_by:{name:asc}) {
                    id
                      name
                      sent_invitation
                      sent_save_the_date
                      rsvp
                    }
                  }
                  `,
      }),
    })
      .then(response => response.json())
      .then(responseData => setData(responseData.data.wedding_guests));
  }, [lastUpdated]);
  const updateGuest = useCallback((id, patch) => {
    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        query: `mutation updateGuest($id:uuid,$patch:wedding_guests_set_input) {
                update_wedding_guests(_set:$patch, where:{id:{_eq:$id}}) {
                  affected_rows
                }
              }`,
        variables: {
          id,
          patch,
        },
      }),
    }).then(() => setLastUpdated(new Date().getTime()));
  }, []);
  const deleteGuest = useCallback(id => {
    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({
        query: `mutation deleteGuest($id:uuid) {
            delete_wedding_guests(where:{id:{_eq:$id}}) {
              affected_rows
            }
          }`,
        variables: {
          id,
        },
      }),
    }).then(() => setLastUpdated(new Date().getTime()));
  }, []);
  return (
    <Page>
      <div style={{ display: "flex", marginBottom: 16 }}>
        <h2 className="title is-4">Wedding Guests</h2>
        <Link href="/add-guest">
          <button style={{ marginLeft: "auto" }} className="button">
            Add Guest
          </button>
        </Link>
      </div>
      <table className="table is-striped is-fullwidth">
        <thead className="thead">
          <tr>
            <th>Name</th>
            <th>Sent Save the Date</th>
            <th>Sent Invitation</th>
            <th>RSVP</th>
            <th />
          </tr>
        </thead>
        <tbody className="tbody">
          {data &&
            data.map(({ id, name, sent_invitation, sent_save_the_date, rsvp }) => (
              <tr key={id}>
                <td>{name}</td>
                <td>
                  <input
                    onClick={() => updateGuest(id, { sent_save_the_date: !sent_save_the_date })}
                    type="checkbox"
                    className="checkbox"
                    checked={sent_save_the_date}
                  />
                </td>
                <td>
                  <input
                    onClick={() => updateGuest(id, { sent_invitation: !sent_invitation })}
                    type="checkbox"
                    className="checkbox"
                    checked={sent_invitation}
                  />
                </td>
                <td>
                  <input
                    onClick={() => updateGuest(id, { rsvp: !rsvp })}
                    type="checkbox"
                    className="checkbox"
                    checked={rsvp}
                  />
                </td>
                <td>
                  <button
                    onClick={() => deleteGuest(id)}
                    disabled={sent_save_the_date}
                    className={`button is-outlined${sent_save_the_date ? " is-disabled" : " is-danger"}`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Page>
  );
};
