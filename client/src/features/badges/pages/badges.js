import React, { useState, useEffect } from 'react'
import { pdf, Document, Page, View, Text, StyleSheet, Image as PdfImage, Font } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { Button, Form, Table, Card, Row, Col,  Spinner } from 'react-bootstrap'
import { FaRegFilePdf} from 'react-icons/fa'
import { BiTrash } from 'react-icons/bi'

import BadgesService from '../services/BadgesService'
import ButtonAll from '../../../Components/ButtonAll/ButtonAll'
import styles from './style.module.css'
import logoImage from './logo.jpg'
import HeliosCondC_ from '../fonts/helioscondc.ttf'

const API_URL = process.env.REACT_APP_API_URL

Font.register({
     family: 'HeliosCondC',
     src: HeliosCondC_,
})

// Стили для PDF
const pdfStyles = StyleSheet.create({
     page: {
          padding: '15mm',
          fontFamily: 'HeliosCondC',
     },
     pageContent: {
          flexDirection: 'column',
     },
     pairContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
     },
     badgeContainer: {
          width: '90mm',
          height: '57mm',
          border: '1px solid rgb(199, 199, 199)',
     },
     photoContainer: {
          width: '30mm',
          height: '40mm',
          border: '1px solid #ccc',
          margin: '2mm',
     },
     photoImage: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
     },
     header: {
          width: '100%',
          height: '15mm',
          backgroundColor: '#003366',
          color: 'white',
          flexDirection: 'row',
          alignItems: 'center',
     },
     logo: {
          height: '15mm',
          width: 'auto',
     },
     companyName: {
          flex: 1,
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 'bold',
     },
     nameSection: {
          width: '100%',
          height: '27mm',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2mm',
     },
     footer: {
          width: '100%',
          height: '15mm',
          backgroundColor: '#0079C2',
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2mm',
          position: 'absolute',
          bottom: 0,
     },
     position: {
          fontSize: 12,
          textAlign: 'center',
          width: '100%',
     },
     safetyOfficer: {
          fontSize: 10,
          color: '#FFD700',
          textAlign: 'center',
          width: '100%',
          marginTop: 2,
     },
     lastName: {
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 2,
     },
     firstName: {
          fontSize: 18,
          fontWeight: 'normal',
     },
})

const BadgePDF = ({ badges, getDepartmentById, getDolgnostByCode }) => {
     const itemsPerPage = 4
     const splitName = (fio) => {
          const parts = fio.split(' ')
          return {
               lastName: parts[0],
               firstName: parts.slice(1).join(' '),
          }
     }

     return (
          <Document>
               {Array.from({ length: Math.ceil(badges.length / itemsPerPage) }).map((_, pageIndex) => (
                    <Page key={pageIndex} size="A4" style={pdfStyles.page}>
                         <View style={pdfStyles.pageContent}>
                              {badges
                                   .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                                   .map((badge, idx) => {
                                        const { lastName, firstName } = splitName(badge.fio)

                                        return (
                                             <View key={idx} style={pdfStyles.pairContainer}>
                                                  {/* Оригинал */}
                                                  <View style={pdfStyles.badgeContainer}>
                                                       <View style={pdfStyles.header}>
                                                            <PdfImage src={logoImage} style={pdfStyles.logo} />
                                                            <Text style={pdfStyles.companyName}>Вуктыльское ЛПУМГ</Text>
                                                       </View>
                                                       <View style={pdfStyles.nameSection}>
                                                            <Text style={pdfStyles.lastName}>{lastName}</Text>
                                                            <Text style={pdfStyles.firstName}>{firstName}</Text>
                                                       </View>
                                                       <View style={pdfStyles.footer}>
                                                            <Text style={pdfStyles.position}>
                                                                 {`${getDolgnostByCode(
                                                                      badge.post
                                                                 )}, ${getDepartmentById(badge.department)}`}
                                                            </Text>
                                                            {badge.isSafetyOfficer && (
                                                                 <Text style={pdfStyles.safetyOfficer}>
                                                                      Уполномоченный по ОТ
                                                                 </Text>
                                                            )}
                                                       </View>
                                                  </View>

                                                  {/* Копия */}
                                                  <View style={pdfStyles.badgeContainer}>
                                                       <View style={pdfStyles.header}>
                                                            <PdfImage src={logoImage} style={pdfStyles.logo} />
                                                            <Text style={pdfStyles.companyName}>Вуктыльское ЛПУМГ</Text>
                                                       </View>
                                                       <View style={pdfStyles.nameSection}>
                                                            <Text style={pdfStyles.lastName}>{lastName}</Text>
                                                            <Text style={pdfStyles.firstName}>{firstName}</Text>
                                                       </View>
                                                       <View style={pdfStyles.footer}>
                                                            <Text style={pdfStyles.position}>
                                                                 {`${getDolgnostByCode(
                                                                      badge.post
                                                                 )}, ${getDepartmentById(badge.department)}`}
                                                            </Text>
                                                            {badge.isSafetyOfficer && (
                                                                 <Text style={pdfStyles.safetyOfficer}>
                                                                      Уполномоченный по ОТ
                                                                 </Text>
                                                            )}
                                                       </View>
                                                  </View>
                                             </View>
                                        )
                                   })}
                         </View>
                    </Page>
               ))}
          </Document>
     )
}

const PhotoPDF = ({ badges }) => {
     const itemsPerPage = 30 // 8 фото на странице (2 ряда по 4)

     return (
          <Document>
               {Array.from({ length: Math.ceil(badges.length / itemsPerPage) }).map((_, pageIndex) => (
                    <Page key={pageIndex} size="A4" style={pdfStyles.page}>
                         <View
                              style={{
                                   flexDirection: 'row',
                                   flexWrap: 'wrap',
                                   justifyContent: 'space-around',
                                   padding: '10mm',
                              }}
                         >
                              {badges
                                   .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                                   .map((badge, idx) => (
                                        <View key={idx} style={pdfStyles.photoContainer}>
                                             <PdfImage
                                                  src={`${API_URL}static/photo/${badge.tabNumber}.jpg`}
                                                  style={pdfStyles.photoImage}
                                             />
                                        </View>
                                   ))}
                         </View>
                    </Page>
               ))}
          </Document>
     )
}

function BadgePage() {
     const [staffList, setStaffList] = useState([])
     const [selectedBadges, setSelectedBadges] = useState([])
     const [searchQuery, setSearchQuery] = useState('')
     const [isLoading, setIsLoading] = useState(true)
     const [departments, setDepartments] = useState([])
     const [dolgnostList, setDolgnostList] = useState([])
     const [photoStatus, setPhotoStatus] = useState({})

     const [outputType, setOutputType] = useState('badges') // 'badges' или 'photos'

     useEffect(() => {
          const fetchInitialData = async () => {
               try {
                    const [departments, dolgnost] = await Promise.all([
                         BadgesService.fetchAllDepartments(),
                         BadgesService.fetchAllDolgnost(),
                    ])
                    setDepartments(departments)
                    setDolgnostList(dolgnost)
               } catch (error) {
                    console.error(error)
               }
          }
          fetchInitialData()
     }, [])

     const getDolgnostByCode = (code) => {
          const dolgnost = dolgnostList.find((d) => d.dolgn === code)
          return dolgnost ? dolgnost.dolgn_s : code
     }

     const getDepartmentById = (id) => {
          const departmentCode = String(id).split(' ')[0]
          const foundDepartment = departments.find((department) => department.code === departmentCode)
          return foundDepartment ? foundDepartment.short_name : null
     }

     useEffect(() => {
          const fetchStaff = async () => {
               try {
                    const fetchedStaff = await BadgesService.fetchStaff()
                    setStaffList(fetchedStaff)

                    // Проверяем наличие фото для каждого сотрудника
                    fetchedStaff.forEach((staff) => {
                         checkPhotoExists(staff.tabNumber)
                    })
               } catch (error) {
                    console.error('Error fetching staff:', error)
               } finally {
                    setIsLoading(false)
               }
          }
          fetchStaff()
     }, [])

     const checkPhotoExists = (tabNumber) => {
          if (!tabNumber) return

          setPhotoStatus((prev) => ({ ...prev, [tabNumber]: 'loading' }))

          const img = new Image()
          img.src = `${API_URL}static/photo/${tabNumber}.jpg?t=${Date.now()}`

          const onLoad = () => {
               if (img.width > 0) {
                    setPhotoStatus((prev) => ({ ...prev, [tabNumber]: 'photo' }))
               } else {
                    setPhotoStatus((prev) => ({ ...prev, [tabNumber]: 'error' }))
               }
          }

          const onError = () => {
               setPhotoStatus((prev) => ({ ...prev, [tabNumber]: 'error' }))
          }

          img.addEventListener('load', onLoad)
          img.addEventListener('error', onError)

          return () => {
               img.removeEventListener('load', onLoad)
               img.removeEventListener('error', onError)
          }
     }

     const handleAddBadge = (staffMember) => {
          const newBadge = {
               ...staffMember,
               uid: Date.now() + Math.random(),
               isSafetyOfficer: false,
          }
          setSelectedBadges([...selectedBadges, newBadge])
     }

     const handleRemoveBadge = (uid) => {
          setSelectedBadges(selectedBadges.filter((b) => b.uid !== uid))
     }

     const handleGeneratePDF = async () => {
          if (selectedBadges.length === 0) {
               alert('Добавьте сотрудников для генерации')
               return
          }

          if (outputType === 'photos') {
               // Для фото проверяем, есть ли хотя бы одно фото
               const hasPhotos = selectedBadges.some((badge) => photoStatus[badge.tabNumber] === 'photo')

               if (!hasPhotos) {
                    alert('Нет доступных фото для выбранных сотрудников')
                    return
               }
          }

          const blob = await pdf(
               outputType === 'badges' ? (
                    <BadgePDF
                         badges={selectedBadges}
                         getDepartmentById={getDepartmentById}
                         getDolgnostByCode={getDolgnostByCode}
                    />
               ) : (
                    <PhotoPDF badges={selectedBadges.filter((badge) => photoStatus[badge.tabNumber] === 'photo')} />
               )
          ).toBlob()

          saveAs(blob, `${outputType}_${new Date().toISOString().slice(0, 10)}.pdf`)
     }

     const filteredStaff = staffList.filter(
          (staffMember) =>
               staffMember.fio.toLowerCase().includes(searchQuery.toLowerCase()) ||
               staffMember.post.toLowerCase().includes(searchQuery.toLowerCase()) ||
               staffMember.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
               staffMember.tabNumber.includes(searchQuery)
     )

     if (isLoading) {
          return (
               <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <Spinner animation="border" variant="primary" />
               </div>
          )
     }

     return (
          <div className="p-3">
               <div className="d-flex justify-content-between mb-3">
                    <div className="d-flex gap-2">
                         <ButtonAll text="Выгрузить в PDF" icon={FaRegFilePdf} onClick={handleGeneratePDF} />
                         <Form.Group  controlId="outputTypeSelect" className={styles.select}>
                              <Form.Select
                                   value={outputType}
                                   onChange={(e) => setOutputType(e.target.value)}
                                   className={styles.selectopt}
                              >
                                   <option value="badges">Формировать бейджики</option>
                                   <option value="photos">Формировать фото 3×4</option>
                              </Form.Select>
                         </Form.Group>
                    </div>
               </div>

               <Row>
                    <Col md={5}>
                         <div className="mb-3 bg-light rounded-3 p-2">
                              <Form.Control
                                   type="text"
                                   placeholder="Поиск сотрудников..."
                                   value={searchQuery}
                                   onChange={(e) => setSearchQuery(e.target.value)}
                              />
                         </div>

                         <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                              <Table striped bordered hover className={styles.tabl}>
                                   <thead>
                                        <tr>
                                             <th>ФИО</th>
                                             <th>Должность</th>
                                             <th>Фото</th>
                                             <th></th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {filteredStaff.map((staffMember) => (
                                             <tr key={staffMember.tabNumber}>
                                                  <td>{staffMember.fio}</td>
                                                  <td>{getDolgnostByCode(staffMember.post)}</td>
                                                  <td>
                                                       {photoStatus[staffMember.tabNumber] === 'loading' && (
                                                            <Spinner animation="border" size="sm" />
                                                       )}
                                                       {photoStatus[staffMember.tabNumber] === 'photo' && (
                                                            <span className="text-success">Есть</span>
                                                       )}
                                                       {photoStatus[staffMember.tabNumber] === 'error' && (
                                                            <span className="text-muted">Нет</span>
                                                       )}
                                                  </td>
                                                  <td>
                                                       <Button
                                                            variant="link"
                                                            size="sm"
                                                            onClick={() => handleAddBadge(staffMember)}
                                                       >
                                                            Добавить
                                                       </Button>
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </Table>
                         </div>

                         <h5 className="mt-4">Выбранные сотрудники</h5>
                         <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                              <Table striped bordered hover className={styles.tabl}>
                                   <thead>
                                        <tr>
                                             <th></th>
                                             <th>ФИО</th>
                                             <th>Должность</th>
                                             <th>Отдел</th>

                                             {outputType === 'badges' && <th>Уп. по ОТ</th>}
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {selectedBadges.map((badge) => (
                                             <tr key={badge.uid}>
                                                  <td>
                                                       <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="text-danger p-0"
                                                            onClick={() => handleRemoveBadge(badge.uid)}
                                                       >
                                                            <BiTrash />
                                                       </Button>
                                                  </td>
                                                  <td>{badge.fio}</td>
                                                  <td>{getDolgnostByCode(badge.post)}</td>
                                                  <td>{getDepartmentById(badge.department)}</td>

                                                  {outputType === 'badges' && (
                                                       <td>
                                                            <Form.Check
                                                                 type="checkbox"
                                                                 checked={badge.isSafetyOfficer || false}
                                                                 onChange={(e) => {
                                                                      const updated = selectedBadges.map((b) =>
                                                                           b.uid === badge.uid
                                                                                ? {
                                                                                       ...b,
                                                                                       isSafetyOfficer:
                                                                                            e.target.checked,
                                                                                  }
                                                                                : b
                                                                      )
                                                                      setSelectedBadges(updated)
                                                                 }}
                                                            />
                                                       </td>
                                                  )}
                                             </tr>
                                        ))}
                                   </tbody>
                              </Table>
                         </div>
                    </Col>

                    <Col md={7} style={{ maxHeight: '700px', overflowY: 'auto' }}>
                         {outputType === 'badges' ? (
                              <div className="d-flex flex-wrap gap-3">
                                   {selectedBadges.map((badge, index) => (
                                        <Card key={index} style={{ width: '180mm' }}>
                                             <Card.Body className="p-0">
                                                  <Row className="g-0">
                                                       <Col md={6}>
                                                            <div className={`${styles.badge} ${styles.textCenter}`}>
                                                                 <div
                                                                      className={`${styles.badgeHeader} d-flex align-items-center`}
                                                                 >
                                                                      <img
                                                                           src={logoImage}
                                                                           alt="Логотип"
                                                                           className={styles.badgeLogo}
                                                                      />
                                                                      <div
                                                                           className={`${styles.badgeCompanyName} w-100`}
                                                                      >
                                                                           <h5 className="m-0">Вуктыльское ЛПУМГ</h5>
                                                                      </div>
                                                                 </div>
                                                                 <div className={styles.badgeNameSection}>
                                                                      <h4
                                                                           className={`${styles.badgeFullName} fw-bold p-1`}
                                                                      >
                                                                           {badge.fio}
                                                                      </h4>
                                                                 </div>
                                                                 <div className={styles.badgeFooter}>
                                                                      <div className="p-1">
                                                                           <h6 className="m-0">{`${getDolgnostByCode(
                                                                                badge.post
                                                                           )}, ${getDepartmentById(
                                                                                badge.department
                                                                           )}`}</h6>
                                                                           {badge.isSafetyOfficer && (
                                                                                <div
                                                                                     className="mt-1 text-warning"
                                                                                     style={{ fontSize: '0.8rem' }}
                                                                                >
                                                                                     Уполномоченный по ОТ
                                                                                </div>
                                                                           )}
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       </Col>
                                                       <Col md={6}>
                                                            <div className={`${styles.badge} ${styles.textCenter}`}>
                                                                 <div
                                                                      className={`${styles.badgeHeader} d-flex align-items-center`}
                                                                 >
                                                                      <img
                                                                           src={logoImage}
                                                                           alt="Логотип"
                                                                           className={styles.badgeLogo}
                                                                      />
                                                                      <div
                                                                           className={`${styles.badgeCompanyName} w-100`}
                                                                      >
                                                                           <h5 className="m-0">Вуктыльское ЛПУМГ</h5>
                                                                      </div>
                                                                 </div>
                                                                 <div className={styles.badgeNameSection}>
                                                                      <h4
                                                                           className={`${styles.badgeFullName} fw-bold p-1`}
                                                                      >
                                                                           {badge.fio}
                                                                      </h4>
                                                                 </div>
                                                                 <div className={styles.badgeFooter}>
                                                                      <div className="p-1">
                                                                           <h6 className="m-0">{`${getDolgnostByCode(
                                                                                badge.post
                                                                           )}, ${getDepartmentById(
                                                                                badge.department
                                                                           )}`}</h6>
                                                                           {badge.isSafetyOfficer && (
                                                                                <div
                                                                                     className="mt-1 text-warning"
                                                                                     style={{ fontSize: '0.8rem' }}
                                                                                >
                                                                                     Уполномоченный по ОТ
                                                                                </div>
                                                                           )}
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       </Col>
                                                  </Row>
                                             </Card.Body>
                                        </Card>
                                   ))}
                              </div>
                         ) : (
                              <div className="d-flex flex-wrap gap-3">
                                   {selectedBadges
                                        .filter((badge) => photoStatus[badge.tabNumber] === 'photo')
                                        .map((badge, index) => (
                                             <Card key={index} style={{ width: '30mm', height: '40mm' }}>
                                                  <Card.Body className="p-0">
                                                       <img
                                                            src={`${API_URL}static/photo/${badge.tabNumber}.jpg`}
                                                            alt={badge.fio}
                                                            style={{
                                                                 width: '100%',
                                                                 height: '100%',
                                                                 objectFit: 'cover',
                                                            }}
                                                            onError={(e) => {
                                                                 e.target.src = ''
                                                                 e.target.alt = 'Фото не найдено'
                                                                 e.target.style.backgroundColor = '#f8f9fa'
                                                                 e.target.style.display = 'flex'
                                                                 e.target.style.justifyContent = 'center'
                                                                 e.target.style.alignItems = 'center'
                                                                 e.target.style.color = '#6c757d'
                                                            }}
                                                       />
                                                  </Card.Body>
                                                  <Card.Footer className="p-1 text-center small">
                                                       {badge.fio.split(' ')[0]}
                                                  </Card.Footer>
                                             </Card>
                                        ))}
                              </div>
                         )}
                    </Col>
               </Row>
          </div>
     )
}

export default BadgePage
