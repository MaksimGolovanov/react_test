import React, { useState, useEffect } from 'react'
import { pdf, Document, Page, View, Text, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { Button, Form, Table, Card, Row, Col } from 'react-bootstrap'
import { FaRegFilePdf } from 'react-icons/fa6'
import { BiArrowBack, BiTrash } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import StaffService from '../services/StaffService'

Font.register({
     family: 'Roboto',
     fonts: [
          {
               src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf',
          },
     ],
})
// Стили для PDF
const pdfStyles = StyleSheet.create({
     page: {
          position: 'relative',
          width: '210mm',
          height: '297mm',
          fontFamily: 'Roboto', // Указываем наш шрифт
     },
     badgeContainer: {
          position: 'absolute',
          width: '90mm',
          height: '50mm',
          border: '1px solid #000',
     },
     firstBadge: {
          top: '20mm',
          left: '15mm',
     },
     secondBadge: {
          top: '20mm',
          left: '105mm', // 15mm + 90mm
     },
     header: {
          width: '100%',
          height: '15mm',
          backgroundColor: '#003366',
          color: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: '2mm',
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
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2mm',
     },
     fullName: {
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
     },
     footer: {
          width: '100%',
          height: '15mm',
          backgroundColor: '#0079C2',
          color: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2mm',
     },
     position: {
          fontSize: 12,
          textAlign: 'center',
     },
})

// Компонент бейджика для PDF
const BadgePDF = ({ badges }) => (
     <Document>
          {Array.from({ length: Math.ceil(badges.length / 2) }).map((_, pageIndex) => (
               <Page key={pageIndex} size="A4" style={pdfStyles.page}>
                    {/* Первый бейджик */}
                    <View style={pdfStyles.badge}>
                         <View style={pdfStyles.header}>
                              <Image src="/logo.jpg" style={pdfStyles.logo} />
                              <Text style={pdfStyles.companyName}>Вуктыльское ЛПУМГ</Text>
                         </View>
                         <Text style={pdfStyles.fullName}>{badges[pageIndex * 2]?.fio || ''}</Text>
                         <Text style={pdfStyles.position}>
                              {badges[pageIndex * 2]
                                   ? `${badges[pageIndex * 2].post} ${badges[pageIndex * 2].department}`
                                   : ''}
                         </Text>
                    </View>

                    {/* Второй бейджик */}
                    <View style={pdfStyles.badge}>
                         <View style={pdfStyles.header}>
                              <Image src="/logo.jpg" style={pdfStyles.logo} />
                              <Text style={pdfStyles.companyName}>Вуктыльское ЛПУМГ</Text>
                         </View>
                         <Text style={pdfStyles.fullName}>{badges[pageIndex * 2 + 1]?.fio || ''}</Text>
                         <Text style={pdfStyles.position}>
                              {badges[pageIndex * 2 + 1]
                                   ? `${badges[pageIndex * 2 + 1].post} ${badges[pageIndex * 2 + 1].department}`
                                   : ''}
                         </Text>
                    </View>
               </Page>
          ))}
     </Document>
)

function BadgePage() {
     const [staffList, setStaffList] = useState([])
     const [selectedBadges, setSelectedBadges] = useState([])
     const [searchQuery, setSearchQuery] = useState('')
     const [isLoading, setIsLoading] = useState(true)
     const navigate = useNavigate()

     useEffect(() => {
          const fetchStaff = async () => {
               try {
                    const fetchedStaff = await StaffService.fetchStaff()
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
          if (!selectedBadges.some((b) => b.tabNumber === staffMember.tabNumber)) {
               setSelectedBadges([...selectedBadges, staffMember])
          }
     }

     const handleRemoveBadge = (tabNumber) => {
          setSelectedBadges(selectedBadges.filter((b) => b.tabNumber !== tabNumber))
     }

     const handleGeneratePDF = async () => {
          if (selectedBadges.length === 0) {
               alert('Добавьте сотрудников для генерации бейджиков')
               return
          }

          const blob = await pdf(<BadgePDF badges={selectedBadges} />).toBlob()
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
               <Button variant="outline-primary" onClick={() => navigate(-1)} className="mb-3">
                    <BiArrowBack /> Назад
               </Button>

               <h3 className="mt-2 mb-3">Бейджики</h3>

               <Button variant="primary" onClick={handleGeneratePDF} className="mb-3">
                    <FaRegFilePdf className="me-2" /> Выгрузить в PDF
               </Button>

               <Row>
                    <Col md={4}>
                         <div className="mb-3 bg-light rounded-3 p-2">
                              <Form.Control
                                   type="text"
                                   placeholder="Поиск сотрудников..."
                                   value={searchQuery}
                                   onChange={(e) => setSearchQuery(e.target.value)}
                              />
                         </div>

                         <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                              <Table striped bordered hover>
                                   <tbody>
                                        {filteredStaff.map((staffMember) => (
                                             <tr key={staffMember.tabNumber} className="align-middle">
                                                  <td>
                                                       <Button
                                                            variant="link"
                                                            onClick={() => handleAddBadge(staffMember)}
                                                            className="p-0 text-start"
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
                                   <tbody>
                                        {selectedBadges.map((badge, index) => (
                                             <tr key={index} className="align-middle">
                                                  <td>
                                                       <Button
                                                            variant="link"
                                                            onClick={() => handleRemoveBadge(badge.tabNumber)}
                                                            className="p-0 text-danger"
                                                       >
                                                            <BiTrash />
                                                       </Button>
                                                  </td>
                                                  <td>{badge.fio}</td>
                                                  <td>{badge.post}</td>
                                                  <td>{badge.department}</td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </Table>
                         </div>
                    </Col>

                    <Col md={8} style={{ maxHeight: '800px', overflowY: 'auto' }}>
                         <div className="d-flex flex-wrap gap-3">
                              {selectedBadges.map((badge, index) => (
                                   <div key={index} className="mb-3">
                                        <Card style={{ width: '180mm' }}>
                                             <Card.Body className="p-0">
                                                  <Row className="g-0">
                                                       <Col md={6}>
                                                            <div
                                                                 className="text-center"
                                                                 style={{ width: '90mm', height: '57mm' }}
                                                            >
                                                                 <div
                                                                      style={{
                                                                           width: '100%',
                                                                           height: '15mm',
                                                                           backgroundColor: '#003366',
                                                                           color: 'white',
                                                                      }}
                                                                      className="d-flex align-items-center"
                                                                 >
                                                                      <img
                                                                           src="/logo.jpg"
                                                                           alt="Логотип"
                                                                           style={{ height: '15mm' }}
                                                                      />
                                                                      <div className="text-center w-100">
                                                                           <h5 className="m-0">Вуктыльское ЛПУМГ</h5>
                                                                      </div>
                                                                 </div>
                                                                 <div
                                                                      style={{ width: '100%', height: '27mm' }}
                                                                      className="d-flex align-items-center justify-content-center"
                                                                 >
                                                                      <h4 className="fw-bold p-1">{badge.fio}</h4>
                                                                 </div>
                                                                 <div
                                                                      style={{
                                                                           width: '100%',
                                                                           height: '15mm',
                                                                           backgroundColor: '#0079C2',
                                                                           color: 'white',
                                                                      }}
                                                                      className="d-flex align-items-center justify-content-center"
                                                                 >
                                                                      <h6 className="p-1">{`${badge.post} ${badge.department}`}</h6>
                                                                 </div>
                                                            </div>
                                                       </Col>
                                                       <Col md={6}>
                                                            <div
                                                                 className="text-center"
                                                                 style={{ width: '90mm', height: '57mm' }}
                                                            >
                                                                 <div
                                                                      style={{
                                                                           width: '100%',
                                                                           height: '15mm',
                                                                           backgroundColor: '#003366',
                                                                           color: 'white',
                                                                      }}
                                                                      className="d-flex align-items-center"
                                                                 >
                                                                      <img
                                                                           src="/logo.jpg"
                                                                           alt="Логотип"
                                                                           style={{ height: '15mm' }}
                                                                      />
                                                                      <div className="text-center w-100">
                                                                           <h5 className="m-0">Вуктыльское ЛПУМГ</h5>
                                                                      </div>
                                                                 </div>
                                                                 <div
                                                                      style={{ width: '100%', height: '27mm' }}
                                                                      className="d-flex align-items-center justify-content-center"
                                                                 >
                                                                      <h4 className="fw-bold p-1">{badge.fio}</h4>
                                                                 </div>
                                                                 <div
                                                                      style={{
                                                                           width: '100%',
                                                                           height: '15mm',
                                                                           backgroundColor: '#0079C2',
                                                                           color: 'white',
                                                                      }}
                                                                      className="d-flex align-items-center justify-content-center"
                                                                 >
                                                                      <h6 className="p-1">{`${badge.post} ${badge.department}`}</h6>
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
