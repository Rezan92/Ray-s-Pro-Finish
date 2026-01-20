import React, { useState, useRef, useEffect, useCallback } from 'react';
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

	const updatePosition = useCallback(() => {
		if (triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setCoords({
				top: rect.top - 8,
				left: rect.left + rect.width / 2,
			});
		}
	}, []);

	const showTooltip = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		updatePosition();
		setIsVisible(true);
	};

	const hideTooltip = () => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			setIsVisible(false);
			timeoutRef.current = null;
		}, 200);
	};

	useEffect(() => {
		if (isVisible) {
			window.addEventListener('scroll', updatePosition, true);
			window.addEventListener('resize', updatePosition);
		}
		return () => {
			window.removeEventListener('scroll', updatePosition, true);
			window.removeEventListener('resize', updatePosition);
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [isVisible, updatePosition]);

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
							position: 'fixed',
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
