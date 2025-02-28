import React, { useState, useEffect } from 'react'
import styles from './AdminCategory.module.css'
import api from '../../util/api'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const AdminCategory = () => {
    const [categories, setCategories] = useState([])
    const [newCategory, setNewCategory] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editingName, setEditingName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        try {
            const response = await api.get('/get-categories')
            if (response.status === 200) {
                setCategories(response.data)
            }
        } catch (err) {
            console.error('카테고리 로딩 실패:', err)
        }
    }

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return
        try {
            setIsLoading(true)
            const response = await api.post('/add-category', {
                name: newCategory
            })
            if (response.status === 200) {
                setNewCategory('')
                fetchCategories()
            }
        } catch (err) {
            console.error('카테고리 추가 실패:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditCategory = async (id) => {
        if (!editingName.trim()) return
        try {
            setIsLoading(true)
            const response = await api.put('/update-category', {
                id,
                name: editingName
            })
            if (response.status === 200) {
                setEditingId(null)
                setEditingName('')
                fetchCategories()
            }
        } catch (err) {
            console.error('카테고리 수정 실패:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return
        try {
            setIsLoading(true)
            const response = await api.delete(`/delete-category/${id}`)
            if (response.status === 200) {
                fetchCategories()
            }
        } catch (err) {
            console.error('카테고리 삭제 실패:', err)
        } finally {
            setIsLoading(false)
        }
    }

    const onDragEnd = async (result) => {
        if (!result.destination) return

        const items = Array.from(categories)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        // 새로운 인덱스 할당
        const updatedItems = items.map((item, index) => ({
            ...item,
            index
        }))

        setCategories(updatedItems)

        try {
            await api.post('/update-category-order', {
                categories: updatedItems.map(item => ({
                    id: item._id,
                    index: item.index
                }))
            })
        } catch (err) {
            console.error('카테고리 순서 업데이트 실패:', err)
            fetchCategories() // 실패시 원래 순서로 복구
        }
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.add_category}>
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="새 카테고리 이름"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                />
                <button onClick={handleAddCategory}>추가</button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="categories">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={styles.category_list}
                        >
                            {categories.map((category, index) => (
                                <Draggable
                                    key={category._id}
                                    draggableId={category._id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={styles.category_item}
                                        >
                                            <div className={styles.drag_handle}>⋮</div>
                                            {editingId === category._id ? (
                                                <div className={styles.edit_mode}>
                                                    <input
                                                        type="text"
                                                        value={editingName}
                                                        onChange={(e) => setEditingName(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleEditCategory(category._id)}
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleEditCategory(category._id)}>
                                                        저장
                                                    </button>
                                                    <button onClick={() => setEditingId(null)}>
                                                        취소
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className={styles.view_mode}>
                                                    <span>{category.name}</span>
                                                    <div className={styles.actions}>
                                                        <button
                                                            onClick={() => {
                                                                setEditingId(category._id)
                                                                setEditingName(category.name)
                                                            }}
                                                        >
                                                            수정
                                                        </button>
                                                        <button onClick={() => handleDeleteCategory(category._id)}>
                                                            삭제
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {isLoading && (
                <div className='loading-wrap-dark'>
                    <div className='loading-spinner' />
                </div>
            )}
        </div>
    )
}

export default AdminCategory