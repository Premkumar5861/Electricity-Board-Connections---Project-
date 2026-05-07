import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Messages from "../Messages";


function EditApplicant() {
  const { id } = useParams();
  const [applicantData, setApplicantData] = useState({});
  const [connectionData, setConnectionData] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [Applicant, setApplicant] = useState({
    Applicant_Name: "",
    Gender: "",
    District: "",
    State: "",
    Pincode: "",
    Ownership: "",
    GovtID_Type: "",
    ID_Number: "",
    Category: "",
  });

  const [connection, setConnection] = useState({
    Applicant: "",
    Load_Applied: "",
    Date_of_Application: "",
    Date_of_Approval: "",
    Modified_Date: "",
    Status: "",
    Reviewer_ID: "",
    Reviewer_Name: "",
    Reviewer_Comments: "",
  });

  const fetchApplicant = async () => {
    try {
      const response = await fetch(`/api/update_applicant/${id}/`);
      const data = await response.json();
      
      setApplicantData(data.applicant);
      setConnectionData(data.connection);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicant();
  }, []);

  const handleApplicantChange = (e) => {
    const { name, value } = e.target;
    setApplicantData({ ...applicantData, [name]: value });
  };

  const handleConnectionChange = (e) => {
    const { name, value } = e.target;
    setConnectionData({ ...connectionData, [name]: value });
  };

  if (loading) {
    return <div className="text-center mt-5"> Loading... </div>;

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(connectionData.Load_Applied>200){
        setMessage("Load Applied cannot be greater then 200.")

        setTimeout(()=>{
          setMessage("")
        },3000);
        return;
      }

      await fetch(`/api/update_applicant/${id}/`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          applicant: applicantData,
          connection: connectionData
        }),
      });

      setMessage("Applicant/Connection details has been Updated.")
      setTimeout(()=>{
        setMessage("")
      },3000)

      return;

    }
    catch(error){
      console.log("Error updateing application data",error)
    }
  }

  return (
    <>
      <Container>
        <div className="row">
          <div className="col-md-3">
            {" "}
            <Link to="/" className="btn btn-dark mt-1">
              Go Back
            </Link>
          </div>
        </div>
        <hr
          style={{ height: "1px", border: "none", backgroundColor: "black" }}
        />
        <h5>Edit Applicant or Connection Details</h5>
        <hr
          style={{ height: "1px", border: "none", backgroundColor: "black" }}
        />

        <Form onSubmit={handleSubmit}>
          {message && <Messages variant="info">{message}</Messages> }
          <Row>
            <Col md={6}>
              <Form.Group controlId="Applicant_Name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="Applicant_Name"
                  value={applicantData.Applicant_Name || ""}
                  onChange={handleApplicantChange}
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="Gender" className=" mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="Gender"
                  value={applicantData.Gender || ""}
                  onChange={handleApplicantChange}
                  required
                >
                  <option value={"Male"}>Male</option>
                  <option value={"Female"}>Female</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="District" className="mb-3">
                <Form.Label>District</Form.Label>
                <Form.Control
                  type="text"
                  name="District"
                  value={applicantData.District || ""}
                  onChange={handleApplicantChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="State" className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  name="State"
                  value={applicantData.State}
                  onChange={handleApplicantChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="Pincode" className="mb-3">
                <Form.Label>Pincode</Form.Label>
                <Form.Control
                  type="number"
                  name="Pincode"
                  value={applicantData.Pincode}
                  onChange={handleApplicantChange}
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="Ownership" className="mb-3">
                <Form.Label>Ownership</Form.Label>
                <Form.Control
                  as="select"
                  name="Ownership"
                  value={applicantData.Ownership}
                  onChange={handleApplicantChange}
                  required
                >
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="JOINT">Joint</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="GovtID_Type" className="mb-3">
                <Form.Label>Government ID Type</Form.Label>
                <Form.Control
                  as="select"
                  name="GovtID_Type"
                  value={applicantData.GovtID_Type || ""}
                  onChange={handleApplicantChange}
                  disabled
                  required
                >
                  <option value="AADHAR">Aadhar</option>
                  <option value="VOTER_ID">Voter ID</option>
                  <option value="PAN">PAN</option>
                  <option value="PASSPORT">Passport</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="ID_Number">
                <Form.Label>ID Number</Form.Label>
                <Form.Control
                  type="text"
                  name="ID_Number"
                  value={applicantData.ID_Number || ""}
                  onChange={handleApplicantChange}
                  disabled
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="Category" className="mb-3">
                <Form.Label>Cetegory</Form.Label>
                <Form.Control
                  as="select"
                  name="Category"
                  value={applicantData.Category || ""}
                  onChange={handleApplicantChange}
                  required
                >
                  <option value="Residence">Residence</option>
                  <option value="Commercial">Commercial</option>
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="Load_Applied" className="mb-3">
                <Form.Label>Load Applied</Form.Label>
                <Form.Control
                  type="number"
                  name="Load_Applied"
                  value={connectionData.Load_Applied || ""}
                  onChange={handleConnectionChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="Date_od_Applied" className="mb-3">
                <Form.Label>Date of Applied</Form.Label>
                <Form.Control
                  type="text"
                  name="Date_of_Applied"
                  value={connectionData.Date_of_Application || ""}
                  onChange={handleConnectionChange}
                  disabled
                  required
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="Date_of_Approval" className="mb-3">
                <Form.Label>Date of Approval</Form.Label>
                <Form.Control
                  type="date"
                  name="Date_of_Approval"
                  value={connectionData.Date_of_Approval || ""}
                  onChange={handleConnectionChange}
                  required
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId="Status"className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                as="select"
                name="Status"
                value={connectionData.Status || ""}
                onChange={handleConnectionChange}
                required
                >
                    <option value="Connection Released">Connection Released</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="Reviewer_ID" className="mb-3">
                <Form.Label>Reviewer_ID</Form.Label>
                <Form.Control
                type="text"
                name="Reviewer_ID"
                value={connectionData.Reviewer_ID || ""}
                onChange={handleConnectionChange}
                required
                ></Form.Control>
              </Form.Group>
              <Form.Group controlId="Reviewer_Name" className="mb-3">
                <Form.Label>Reviewer_Name</Form.Label>
                <Form.Control
                type="text"
                name="Reviewer_Name"
                value={connectionData.Reviewer_Name || ""}
                onChange={handleConnectionChange}
                required
                >

                </Form.Control>
              </Form.Group>

              <Form.Group controlId="Reviewer_Comments"  className="mb-3">

                <Form.Label>Reviewer_Comments</Form.Label>
                <Form.Control
                as="select"
                name="Reviewer_Comments"
                value={connectionData.Reviewer_Comments || ""}
                onChange={handleConnectionChange}
                required
                >
                    <option value="Installation Pending">Installation Pending</option>
                    <option value="Documents verification in progress">Documents Verification in progress</option>
                    <option value="Installation completed">Installation Completed</option>
                    <option value="KYC failed">KYC Failed</option>


                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" className="mt-3 text-center" type="Submit">Update</Button>
          <br />
          <br />
          <br />
        </Form>
      </Container>
    </>
  );
}

export default EditApplicant;
