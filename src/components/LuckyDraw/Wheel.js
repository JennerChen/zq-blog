import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

export const SECTOR_COUNT = 8
export const PRIZE_SECTOR_INDEX = 0
export const SPIN_DURATION = 2600

const SECTOR_ANGLE = 360 / SECTOR_COUNT

// 中奖扇区与未中奖扇区交替配色
const background = `conic-gradient(${Array.from({ length: SECTOR_COUNT })
  .map((_, index) => {
    const color =
      index === PRIZE_SECTOR_INDEX
        ? '#ffd591'
        : index % 2 === 0
        ? '#fff7e6'
        : '#fff1d0'
    return `${color} ${index * SECTOR_ANGLE}deg ${(index + 1) *
      SECTOR_ANGLE}deg`
  })
  .join(', ')})`

const Stage = styled.div`
  position: relative;
  width: min(280px, 72vw);
  height: min(280px, 72vw);
  margin: 8px auto 0;
`

const Pointer = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  z-index: 2;
  width: 0;
  height: 0;
  transform: translateX(-50%);
  border-right: 10px solid transparent;
  border-left: 10px solid transparent;
  border-top: 18px solid #f5222d;
`

const Plate = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 6px solid #ffd591;
  border-radius: 50%;
  box-sizing: border-box;
  background: ${background};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: rotate(${props => props.$rotation}deg);
  transition: transform ${SPIN_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1);
`

const LabelWrap = styled.div`
  position: absolute;
  inset: 0;
  transform: rotate(${props => props.$deg}deg);
`

const LabelText = styled.span`
  position: absolute;
  top: 16px;
  left: 50%;
  max-width: 72px;
  overflow: hidden;
  color: ${props => (props.$prize ? '#ad4e00' : '#8c8c8c')};
  font-size: 12px;
  font-weight: ${props => (props.$prize ? 600 : 400)};
  line-height: 1.3;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  transform: translateX(-50%);
`

const Hub = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 56px;
  height: 56px;
  color: #ad4e00;
  font-size: 14px;
  font-weight: 600;
  line-height: 56px;
  text-align: center;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transform: translate(-50%, -50%);
`

// 未中奖时随机停在一个非奖品扇区
export const randomLoseSectorIndex = () =>
  1 + Math.floor(Math.random() * (SECTOR_COUNT - 1))

export default ({ targetIndex, prizeName, onSpinEnd }) => {
  const [rotation, setRotation] = useState(0)
  const endedRef = useRef(false)

  useEffect(() => {
    if (typeof targetIndex !== 'number') return undefined

    endedRef.current = false

    // 多转 5 圈后让指针(正上方)落在目标扇区中心
    const sectorCenter = targetIndex * SECTOR_ANGLE + SECTOR_ANGLE / 2
    setRotation(360 * 5 + (360 - sectorCenter))

    // transitionend 在部分场景不触发, 用定时器兜底
    const timer = setTimeout(() => handleEnd(), SPIN_DURATION + 100)

    return () => clearTimeout(timer)
  }, [targetIndex])

  const handleEnd = () => {
    if (endedRef.current) return
    endedRef.current = true
    if (typeof onSpinEnd === 'function') onSpinEnd()
  }

  return (
    <Stage>
      <Pointer />
      <Plate $rotation={rotation} onTransitionEnd={handleEnd}>
        {Array.from({ length: SECTOR_COUNT }).map((_, index) => {
          const isPrize = index === PRIZE_SECTOR_INDEX
          return (
            <LabelWrap
              key={index}
              $deg={index * SECTOR_ANGLE + SECTOR_ANGLE / 2}
            >
              <LabelText $prize={isPrize}>
                {isPrize ? prizeName : '谢谢参与'}
              </LabelText>
            </LabelWrap>
          )
        })}
        <Hub>抽奖</Hub>
      </Plate>
    </Stage>
  )
}
