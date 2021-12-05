import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import NewAndRepeatVisitor from '../../components/clinics/shared/NewAndRepeatVisitor'
import { Button } from 'antd'

const Intake = ({
	clinic,
}) => {
	const [isHotline, setIsHotline] = useState(true)

	return (
		<>
			<HeaderStyled className="d-flex justify-content-between">
				<h1 className="h2">{isHotline ? 'Hotline Form' : 'Visitor Intake Form'}</h1>
				<Button
					type="primary"
					ghost
					onClick={() => setIsHotline((state) => !state)}
				>
					<span className="small">Switch to</span>&nbsp;<strong>{isHotline ? 'Clinic Intake' : 'Hotline'}</strong>
				</Button>
			</HeaderStyled>

			{!isHotline && <p className="text-danger small mb-2">*Required</p>}

			<NewAndRepeatVisitor
				clinic={clinic}
				isHotline={isHotline}
			/>
		</>
	);
}

const HeaderStyled = styled.div`
	display: flex;
`

export default Intake;
