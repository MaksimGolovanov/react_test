import React, { useState, useEffect } from 'react'
import { pdf, Document, Page, View, Text, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { Button, Form, Table, Card, Row, Col } from 'react-bootstrap'
import { FaRegFilePdf } from 'react-icons/fa6'
import { BiTrash } from 'react-icons/bi'

import BadgesService from '../services/BadgesService'
import ButtonAll from '../../../Components/ButtonAll/ButtonAll'
import styles from './style.module.css'
import logoImage from './logo.jpg'
import HeliosCondC_ from '../fonts/helioscondc.ttf'

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

// Компонент бейджика для PDF
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
                                                            <Image src={logoImage} style={pdfStyles.logo} />
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
                                                            <Image src={logoImage} style={pdfStyles.logo} />
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

function BadgePage() {
     const [staffList, setStaffList] = useState([])
     const [selectedBadges, setSelectedBadges] = useState([])
     const [searchQuery, setSearchQuery] = useState('')
     const [isLoading, setIsLoading] = useState(true)
     const [departmens, setDepatmens] = useState([])
     const [dolgnostList, setDolgnostList] = useState([])
     

     useEffect(() => {
          const fetchInitialData = async () => {
               try {
                    const [departments, dolgnost] = await Promise.all([
                         BadgesService.fetchAllDepartments(),
                         BadgesService.fetchAllDolgnost(),
                    ])
                    setDepatmens(departments)
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
          const foundDepartment = departmens.find((department) => department.code === departmentCode)
          return foundDepartment ? foundDepartment.short_name : null
     }

     useEffect(() => {
          const fetchStaff = async () => {
               try {
                    const fetchedStaff = await BadgesService.fetchStaff()
                    setStaffList(fetchedStaff)
               } catch (error) {
                    console.error('Error fetching staff:', error)
               } finally {
                    setIsLoading(false)
               }
          }
          fetchStaff()
     }, [])

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
               alert('Добавьте сотрудников для генерации бейджиков')
               return
          }
          const blob = await pdf(
               <BadgePDF
                    badges={selectedBadges}
                    getDepartmentById={getDepartmentById}
                    getDolgnostByCode={getDolgnostByCode}
               />
          ).toBlob()
          saveAs(blob, `badges_${new Date().toISOString().slice(0, 10)}.pdf`)
     }

     const filteredStaff = staffList.filter(
          (staffMember) =>
               staffMember.fio.toLowerCase().includes(searchQuery.toLowerCase()) ||
               staffMember.post.toLowerCase().includes(searchQuery.toLowerCase()) ||
               staffMember.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
               staffMember.tabNumber.includes(searchQuery)
     )

     if (isLoading) {
          return <div>Загрузка данных...</div>
     }

     return (
          <div className="p-3">
               <ButtonAll text="Выгрузить в PDF" icon={FaRegFilePdf} onClick={handleGeneratePDF} />
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
                              <Table striped bordered hover>
                                   <tbody>
                                        {filteredStaff.map((staffMember) => (
                                             <tr key={staffMember.tabNumber} className={styles.alignmiddle}>
                                                  <td>
                                                       <Button
                                                            variant="link"
                                                            onClick={() => handleAddBadge(staffMember)}
                                                            className={styles.alignmiddle}
                                                       >
                                                            {staffMember.fio}
                                                       </Button>
                                                  </td>
                                                  <td>{staffMember.post}</td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </Table>
                         </div>

                         <h5 className="mt-4">Выбранные сотрудники</h5>
                         <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                              <Table striped bordered hover className="mt-3">
                                   <thead>
                                        <tr className={styles.alignmiddle}>
                                             <th></th>
                                             <th>ФИО</th>
                                             <th>Должность</th>
                                             <th>Отдел</th>
                                             <th className="text-center">Уп. по ОТ</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {selectedBadges.map((badge) => (
                                             <tr key={badge.uid} className={styles.alignmiddle}>
                                                  <td>
                                                       <Button
                                                            variant="link"
                                                            onClick={() => handleRemoveBadge(badge.uid)}
                                                            className="p-0 text-danger"
                                                       >
                                                            <BiTrash />
                                                       </Button>
                                                  </td>
                                                  <td>{badge.fio}</td>
                                                  <td>{getDolgnostByCode(badge.post)}</td>
                                                  <td>{getDepartmentById(badge.department)}</td>
                                                  <td className="text-center">
                                                       <Form.Check
                                                            type="checkbox"
                                                            checked={badge.isSafetyOfficer || false}
                                                            onChange={(e) => {
                                                                 const updated = selectedBadges.map((b) =>
                                                                      b.uid === badge.uid
                                                                           ? { ...b, isSafetyOfficer: e.target.checked }
                                                                           : b
                                                                 )
                                                                 setSelectedBadges(updated)
                                                            }}
                                                       />
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </Table>
                         </div>
                    </Col>

                    <Col md={7} style={{ maxHeight: '700px', overflowY: 'auto' }}>
                         <div className="d-flex flex-wrap ">
                              {selectedBadges.map((badge, index) => (
                                   <div key={index}>
                                        <Card style={{ width: '180mm' }}>
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
                                                                                     className="mt-1"
                                                                                     style={{
                                                                                          color: '#FFD700',
                                                                                          fontSize: '0.8rem',
                                                                                     }}
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
                                                                                     className="mt-1"
                                                                                     style={{
                                                                                          color: '#FFD700',
                                                                                          fontSize: '0.8rem',
                                                                                     }}
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
                                   </div>
                              ))}
                         </div>
                    </Col>
               </Row>
          </div>
     )
}

export default BadgePage
