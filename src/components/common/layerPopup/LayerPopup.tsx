'use client';

import React, { useEffect, useState } from 'react';
import { LayerPopupProps } from './types';
import { layerPopupStyles } from './layerPopupStyles';
import Button from '../buttons/Button';
import Input from '../inputs/Input';

const LayerPopup: React.FC<LayerPopupProps> = ({
  label,
  type = 'confirm',
  onConfirm,
  setShowLayerPopup,
  ...props
}) => {
  const isConfirmPopup = type === 'confirm'; // 입력창 없는 팝업
  const isConfirmOnlyPopup = type === 'confirm-only'; // 확인 버튼만 있는 팝업
  const [titleData, setTitleData] = useState<string>(''); // 제목 지정

  // 오늘 날짜
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  };

  const handleConfirm = () => {
    if (isConfirmPopup) {
      onConfirm();
    } else if (!isConfirmOnlyPopup) {
      const titleToSave = titleData || getToday();
      onConfirm(titleToSave); // 부모 컴포넌트에 데이터 전달
    } else {
      onConfirm();
    }
    setShowLayerPopup(false); // 팝업 닫기
  };

  const handleCancel = () => {
    setShowLayerPopup(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowLayerPopup(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [setShowLayerPopup]);

  // 공통 Tailwind 클래스
  const containerBaseStyles = 'relative w-full p-6';
  const buttonContainerStyles = 'flex justify-end gap-2 md:gap-3';
  const textContainerStyles = 'flex items-center gap-2';
  const dolmungImageStyles =
    "bg-[url('/images/dolmung.svg')] bg-cover bg-center size-12 md:size-15 flex-shrink-0";

  return (
    <div className="flex justify-center items-center fixed inset-0 bg-overlay z-50 px-4">
      <div className={layerPopupStyles()} {...props}>
        <div
          className={`${containerBaseStyles} ${
            isConfirmPopup || isConfirmOnlyPopup ? 'h-48' : 'h-60'
          }`}
        >
          {isConfirmPopup || isConfirmOnlyPopup ? (
            <div className="flex flex-col justify-between h-full">
              <div className={textContainerStyles}>
                <div className={dolmungImageStyles} aria-hidden="true"></div>
                <span>{label}</span>
              </div>
              <div className={buttonContainerStyles}>
                {!isConfirmOnlyPopup && (
                  <Button label="취소" size="xs" color="lighterGray" onClick={handleCancel} />
                )}
                <Button label="확인" size="xs" onClick={handleConfirm} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-between h-full">
              <div className="flex flex-col items-center gap-5 w-full">
                <div className={textContainerStyles}>
                  <div className={dolmungImageStyles} aria-hidden="true"></div>
                  <span>{label}</span>
                </div>
                <Input
                  id="title"
                  type="text"
                  variant="title"
                  placeholder={getToday()}
                  value={titleData}
                  onChange={event => setTitleData(event.target.value)}
                />
              </div>
              <div className={buttonContainerStyles}>
                <Button label="취소" size="xs" color="lighterGray" onClick={handleCancel} />
                <Button label="확인" size="xs" onClick={handleConfirm} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayerPopup;
