import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import './InfoTooltip.css';

interface InfoTooltipProps {
	message: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ message }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [coords, setCoords] = useState({ top: 0, left: 0 });
	const triggerRef = useRef<HTMLButtonElement>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const showTooltip = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);

		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setCoords({
				top: rect.top + window.scrollY - 8,
				left: rect.left + window.scrollX + rect.width / 2,
			});
		}
		setIsVisible(true);
	};

	const hideTooltip = () => {
		timeoutRef.current = setTimeout(() => {
			setIsVisible(false);
		}, 200);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return (
		<div
			className='info-tooltip-container'
			onMouseEnter={showTooltip}
			onMouseLeave={hideTooltip}
		>
			<button
				ref={triggerRef}
				type='button'
				className='info-tooltip-trigger'
				aria-label='Information'
			>
				<Info size={14} />
			</button>

			{isVisible &&
				createPortal(
					<div
						className='info-tooltip-content'
						style={{
							top: `${coords.top}px`,
							left: `${coords.left}px`,
							position: 'absolute',
						}}
						onMouseEnter={showTooltip}
						onMouseLeave={hideTooltip}
					>
						<p className='info-tooltip-message'>{message}</p>
					</div>,
					document.body
				)}
		</div>
	);
};
