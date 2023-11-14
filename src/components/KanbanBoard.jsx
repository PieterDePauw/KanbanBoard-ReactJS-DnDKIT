import { useEffect, useState, useMemo } from 'react'
import PlusIcon from '../assets/icons/PlusIcon'
import { text } from '@fortawesome/fontawesome-svg-core'
import ColumnContainer from './ColumnContainer'
import generateId from '../utils/generateID'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor
} from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import isEmpty from '../utils/isEmpty'
export default function () {
  const [columns, setColumns] = useState([])
  const [columnsID, setColumnsID] = useState([])
  const [activeColumn, setActiveColumn] = useState()
  const [activeCardCol, setActiveCardCol] = useState()

  useEffect(() => {
    if (columns) {
      const updatedColumnsID = columns.map((col) => col.id)
      setColumnsID(updatedColumnsID)
    }
  }, [columns])
  function createNewColumns() {
    const color = [
      '#F05252',
      '#FACA15',
      '#0E9F6E',
      '#3F83F8',
      '#6875F5',
      '#9061F9',
      '#E74694',
      '#f59e0b',
      '#84cc16',
      '#10b981',
      '#14b8a6',
      '#06b6d4',
      '#0ea5e9',
      '#6366f1',
      '#d946ef',
      '#f43f5e',
      '#f43f5e'
    ]
    const index = Math.floor(Math.random() * color.length)
    const bgColor = color[index]
    const columnToAdd = {
      id: generateId(),
      title: `Todo ${columns.length + 1}`,
      titleFlair: bgColor,
      cards: {}
    }
    setColumns([...columns, columnToAdd])
  }
  function deleteColumn(id) {
    const filteredColumn = columns.filter((col) => col.id !== id)
    setColumns(filteredColumn)
  }
  function updateColumn(id, title) {
    const newColumns = columns.map((col) => {
      if (col.id === id) {
        return { ...col, title }
      } else {
        return col
      }
    })
    setColumns(newColumns)
  }
  function placeCardsInArray(cardsComp, colID) {
    console.log(cardsComp)

    const newColumnsCard = columns.map((col) => {
      if (col.id === colID) {
        return { ...col, cards: { ...col.cards, [generateId()]: cardsComp } }
      }
      return col
    })
    setColumns(newColumnsCard)
    return columns
  }
  function updateCardInArray(cards, columnID) {
    //console.log(cards);
  }
  function onDragStart(e) {
    if (e.active.data.current?.type === 'Column') {
      console.log(e.active.data.current.cards)
      setActiveColumn(e.active.data.current.column)
      setActiveCardCol(e.active.data.current.cards)
      return
    }
  }
  function onDragEnd(e) {
    const { active, over } = e

    if (!over) {
      return
    }
    const activeColumnID = active.id
    const overColumnID = over.id
    if (activeColumnID === overColumnID) {
      return
    } else {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === activeColumnID
        )
        const overColumnIndex = columns.findIndex(
          (col) => col.id === overColumnID
        )
        return arrayMove(columns, activeColumnIndex, overColumnIndex)
      })
    }
  }

  return (
    <>
      <div className="flex w-full items-center justify-end border-b-[1.5px] border-zinc-300 bg-white px-7 py-4">
        <button
          onClick={createNewColumns}
          className="flex h-[40px] w-[180px] min-w-[180px] items-center justify-center rounded-md border border-blue-600 bg-blue-500 p-4 font-semibold text-zinc-100 ring-blue-300 transition hover:ring-1"
        >
          <PlusIcon />
          <span className="ms-3">Add column</span>
        </button>
      </div>
      <div className="scrollbar m-auto flex max-h-[100vh] min-h-screen w-full items-start overflow-y-auto">
        <DndContext
          onDragStart={(e) => onDragStart(e)}
          onDragEnd={(e) => onDragEnd(e)}
        >
          <div className="m-10">
            <div className="grid grid-cols-4 gap-[50px] ">
              <SortableContext items={columnsID}>
                {columns.map((column) => {
                  return (
                    <ColumnContainer
                      key={column.id}
                      column={column}
                      id={column.id}
                      placeCards={placeCardsInArray}
                      deleteCol={deleteColumn}
                      updateColumn={updateColumn}
                      updateCards={updateCardInArray}
                    />
                  )
                })}
              </SortableContext>
            </div>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  placeCards={placeCardsInArray}
                  key={activeColumn.id}
                  id={activeColumn.id}
                  column={activeColumn}
                  deleteCol={deleteColumn}
                  cardData={activeCardCol}
                  updateColumn={updateColumn}
                  updateCards={updateCardInArray}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </>
  )
}
