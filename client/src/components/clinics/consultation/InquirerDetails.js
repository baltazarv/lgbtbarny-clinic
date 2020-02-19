import React, { useState } from 'react';
import { List, Typography, Button, Modal, Tooltip } from 'antd';
import ConsultationDetails from './ConsultationDetails';
// data
import * as peopleFields from '../../../data/peopleFields';
import { formatName, getPeopleByIds } from '../../../data/peopleData';
import * as consultFields from '../../../data/consultionFields';
import { getLawTypes } from '../../../data/lawTypeData';
// utils
import { objectIsEmpty, isoToStandardDate } from '../../../utils';

const InquirerDetails = ({
	// props from parent ConsultationForm
	inquirersSelected,
	inquirers, // object
	consultations,
	lawyers,
	lawTypes,
}) => {

	// state for consultation list modal
	const [consultModalShown, setConsultModalShown] = useState(false);
	const [consultSelected, setConsultSelected] = useState({});

	const showConsultModal = (id, consultation) => {
		const selectedConsult = {
			id,
			fields: consultation,
		};
		setConsultSelected(selectedConsult);
		setConsultModalShown(true);
	}

	const hideConsultModal = () => {
		setConsultModalShown(false);
	}

	const getConsultationListLink = consultation => {
		if (consultation) {
			const renderLawyers = consultation[consultFields.LAWYERS] ? ' with ' + getPeopleByIds(consultation[consultFields.LAWYERS], lawyers) : ' (Lawyer not specified.)';
			return <span>Consultation on {isoToStandardDate(consultation[consultFields.CREATED_ON])} {renderLawyers}</span>
		}
		return null;
	}

	const getConsultationsModalTitle = consultation => {
		// InquirerDetail can be collapsed and modal still mounted when empty inquirer is selected (inquirer is deselected)
		if (consultation && consultation[consultFields.INQUIRERS]) {
			return <span>{getPeopleByIds(consultation[consultFields.INQUIRERS], inquirers)}'s Consultation on {isoToStandardDate(consultation[consultFields.CREATED_ON])}</span>;
		}
		return null;
	}

	const renderListItemForVisitor = (id, fields) => {
		let dataSource = [
			{
				title: peopleFields.GENDER,
				value: fields[peopleFields.GENDER],
			},
			{
				title: "Type(s) of Law",
				value: getLawTypes(fields[peopleFields.LAW_TYPES], lawTypes),
			},
			{
				title: peopleFields.INCOME,
				value: fields[peopleFields.INCOME],
			},
			{
				title: 'Optional/additinal Notes',
				value: fields[peopleFields.INTAKE_NOTES] ? fields[peopleFields.INTAKE_NOTES] : 'NONE',
			},
			{
				title: peopleFields.ADDRESS,
				value: fields[peopleFields.ADDRESS] ? fields[peopleFields.ADDRESS] : 'No address provided.',
			},
			{
				title: peopleFields.EMAIL,
				value: fields[peopleFields.EMAIL] ? fields[peopleFields.EMAIL] : 'No email provided.',
			},
			{
				title: 'Previous Consultations',
				key: peopleFields.CONSULTATIONS,
				value: fields[peopleFields.CONSULTATIONS],
			},
		];
		return <div className="mb-3" key={id}>
			<List
				bordered
				itemLayout="horizontal"
				header={<strong>{formatName(fields)}</strong>}
				dataSource={dataSource}
				size="small"
				renderItem={item => {

					// consultation list
					let content = item.value;
					if (item.key && item.key === peopleFields.CONSULTATIONS) {
						if (item.value && item.value.length > 0) {
							let listItems = item.value.map(id => {
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
							content = <ul>{listItems}</ul>;
						} else {
							content = 'No previous consultations.';
						}
					}

					return (
						<>
							<List.Item key={id}>
								<Typography.Text code>{item.title}</Typography.Text> {content}
							</List.Item>
						</>
					)
				}}
			/>
		</div>
	}

	let inquirerInfo = [];
	if (!objectIsEmpty(inquirersSelected)) {
		for (var key in inquirersSelected) {
			inquirerInfo.push(renderListItemForVisitor(key, inquirersSelected[key]))
		}
	}

	return (
		<>
			{inquirerInfo}

			{/* consultation details */}
			{consultSelected && !objectIsEmpty(consultSelected) &&
				(<Modal
					title={getConsultationsModalTitle(consultSelected.fields)}
					visible={consultModalShown}
					// onOk={}
					onCancel={hideConsultModal}
					footer={[
						<Button key="back" onClick={hideConsultModal}>
							Close
						</Button>,
					]}
				>
					<ConsultationDetails
						consultSelected={consultSelected}
						lawyers={lawyers}
						lawTypes={lawTypes}
					/>
				</Modal>)
			}
		</>
	)
}

export default InquirerDetails;
