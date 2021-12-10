/**
 * from consultation form on visitor select
 * from consultation list on visitor icon click
 */
import React, { useState } from 'react';
import { List, Typography, Button, Modal, Tooltip } from 'antd';
import ConsultationList from './ConsultationList';
// data
import * as peopleFields from '../../data/peopleFields';
import { formatNameNoNick } from '../../data/peopleData';
import { getLawTypes } from '../../data/lawTypeData';
import * as consultFields from '../../data/consultFields';
import { getDispoTags, getStatusForEmptyShortName } from '../../data/consultationData';
// utils
import { objectIsEmpty, isoToStandardDate } from '../../utils';

// if title not specified, title is field name
const DEFAULT_VALUES = {
  fullname: {
    title: 'Full Name',
  },
  [peopleFields.OTHER_NAMES]: {
    title: 'Preferred Name',
    emptyDefault: null,
  },
  [peopleFields.LAW_TYPES]: {
    title: 'Type(s) of Law',
    emptyDefault: 'Type of law not specified.',
  },
  [peopleFields.EMAIL]: {
    title: 'Email Address',
    emptyDefault: 'No email address provided.',
  },
  [peopleFields.PHONE]: {
    emptyDefault: 'No phone number provided.',
  },
  [peopleFields.ADDRESS]: {},
  [peopleFields.GENDER]: {},
  [peopleFields.PRONOUNS]: {},
  [peopleFields.INCOME]: {},
  [peopleFields.CONSULTATIONS]: {
    title: 'Consultations',
    // link: [
    //   consultFields.CREATED_ON,
    //   consultFields.DISPOSITIONS,
    //   consultFields.STATUS,
    // ],
    emptyDefault: 'No previous consultations.',
  },
  [peopleFields.INTAKE_NOTES]: {
    title: 'Optional/additional Notes',
    emptyDefault: 'NONE',
  },
}

const VisitorList = ({
  header,
  visitor,
  listItems,
  lawTypes,

  // consultations
  consultations,
  lawyers,
  renderConsultModalTitle,
}) => {

  // state for consultation list modal
  const [consultModalShown, setConsultModalShown] = useState(false);
  const [consultSelected, setConsultSelected] = useState({});
  const [consultListItems, setConsultListItems] = useState({});

  const showConsultModal = (id, consultation) => {
    setConsultSelected({ ...consultation });
    setConsultModalShown(true);
  }

  const hideConsultModal = () => {
    setConsultModalShown(false);
  }

  // hard-coded link
  const getConsultationListLink = consultation => {
    if (consultation) {
      return <span>{isoToStandardDate(consultation[consultFields.CREATED_ON])} – {getDispoTags(consultation[consultFields.DISPOSITIONS], true)}– {getStatusForEmptyShortName(consultation)}</span>
    }
    return null;
  }

  // let dataSource = [];
  let visitorList = null;
  if (!objectIsEmpty(visitor)) {
    const visitorKey = Object.keys(visitor)[0];
    const visitorFields = visitor[visitorKey];
    let dataSource = listItems.fields.reduce((ds, field) => {

      // VALUE
      let value = visitorFields[field.key];

      // if the value is empty or field not on db
      if (!value) {
        /** Fields not found on DB */
        if (field.key === 'fullname') {
          value = formatNameNoNick(visitorFields);

        } else if (field.emptyDefault === null) {
          // explicitly remove field w empty value
          return ds;

        } else if (field.emptyDefault) {
          // override default empty value
          value = field.emptyDefault;

        } else if (DEFAULT_VALUES[field.key].emptyDefault) {
          // default empty value
          value = DEFAULT_VALUES[field.key].emptyDefault;

        } else {
          return ds;
        }
      } else {
        // value tranformations
        if (field.key === peopleFields.LAW_TYPES) {
          // law types
          value = getLawTypes(visitorFields[field.key], lawTypes);

        } else if (field.key === peopleFields.PRONOUNS) {
          // pronouns
          value = visitorFields[field.key].join(', ');

        } else if (field.key === peopleFields.CONSULTATIONS) {
          // list items
          // field.listItems = { fields: [{ key, title }] }
          if (!objectIsEmpty(field.listItems) && objectIsEmpty(consultListItems)) setConsultListItems(field.listItems);

          // consultation links
          let consultItems = visitorFields[field.key].map(id => {
            const consultation = consultations[id];
            return (
              <List.Item key={id}>
                <Tooltip title="view consultation details">
                  <Button type="link" onClick={() => showConsultModal(id, consultation)}>
                    {getConsultationListLink(consultation)}
                  </Button>
                </Tooltip>
              </List.Item>
            )
          });
          value = <ul>{consultItems}</ul>;
        }
      }

      // TITLE
      let title = field.title ? field.title : DEFAULT_VALUES[field.key].title ? DEFAULT_VALUES[field.key].title : field.key;

      ds.push({
        key: field.key,
        title,
        value,
      })
      return ds;
    }, []);

    visitorList = <div className="mb-3" key={visitorKey}>
      <List
        bordered
        itemLayout="horizontal"
        header={header}
        dataSource={dataSource}
        size="small"
        renderItem={item => {
          let content = item.value;
          return (
            <>
              <List.Item key={item.key}>
                <Typography.Text code>{item.title}</Typography.Text> {content}
              </List.Item>
            </>
          )
        }}
      />
    </div>
  };

  return <>
    {visitorList}

    {/* consultation details modal */}
    {consultSelected && !objectIsEmpty(consultSelected) &&
      (<Modal
        title={renderConsultModalTitle(consultSelected)}
        visible={consultModalShown}
        // onOk={}
        onCancel={hideConsultModal}
        footer={[
          <Button key="back" onClick={hideConsultModal}>
            Close
        </Button>,
        ]}
      >
        <ConsultationList
          consultation={consultSelected}
          lawyers={lawyers}
          lawTypes={lawTypes}
        />
      </Modal>)
    }

  </>
}

export default VisitorList;
