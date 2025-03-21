import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

// Mock data for schools and courses
const schools = ["ENG", "BUS", "ART"];
const courses = {
  ENG: ["ENG101", "ENG102", "ENG103"],
  BUS: ["BUS201", "BUS202", "BUS203"],
  ART: ["ART301", "ART302", "ART303"],
};

const ManageCandidates = () => {
  const [positions, setPositions] = useState([]);
  const [openPositionDialog, setOpenPositionDialog] = useState(false);
  const [openCandidateDialog, setOpenCandidateDialog] = useState(false);
  const [currentPosition, setCurrentPosition] = useState("");
  const [currentCandidate, setCurrentCandidate] = useState({
    id: null,
    name: "",
    part: "",
    school: "",
    course: "",
    manifestoTopic: "",
    manifestoBody: "",
    photo: "",
    video: "",
    positionIndex: null,
  });

  const handleOpenPositionDialog = () => {
    setOpenPositionDialog(true);
  };

  const handleClosePositionDialog = () => {
    setOpenPositionDialog(false);
    setCurrentPosition("");
  };

  const handleSavePosition = () => {
    if (currentPosition.trim()) {
      setPositions([...positions, { title: currentPosition, candidates: [] }]);
      handleClosePositionDialog();
    }
  };

  const handleOpenCandidateDialog = (positionIndex) => {
    setCurrentCandidate({ ...currentCandidate, positionIndex });
    setOpenCandidateDialog(true);
  };

  const handleCloseCandidateDialog = () => {
    setOpenCandidateDialog(false);
    setCurrentCandidate({
      id: null,
      name: "",
      part: "",
      school: "",
      course: "",
      manifestoTopic: "",
      manifestoBody: "",
      photo: "",
      video: "",
      positionIndex: null,
    });
  };

  const handleSaveCandidate = () => {
    if (currentCandidate.name.trim()) {
      const updatedPositions = [...positions];
      if (currentCandidate.id === null) {
        // Add new candidate
        updatedPositions[currentCandidate.positionIndex].candidates.push({
          ...currentCandidate,
          id: updatedPositions[currentCandidate.positionIndex].candidates.length + 1,
        });
      } else {
        // Update existing candidate
        updatedPositions[currentCandidate.positionIndex].candidates = updatedPositions[
          currentCandidate.positionIndex
        ].candidates.map((candidate) =>
          candidate.id === currentCandidate.id ? currentCandidate : candidate
        );
      }
      setPositions(updatedPositions);
      handleCloseCandidateDialog();
    }
  };

  const handleDeleteCandidate = (positionIndex, candidateId) => {
    const updatedPositions = [...positions];
    updatedPositions[positionIndex].candidates = updatedPositions[
      positionIndex
    ].candidates.filter((candidate) => candidate.id !== candidateId);
    setPositions(updatedPositions);
  };

  const handleEditPosition = (positionIndex) => {
    setCurrentPosition(positions[positionIndex].title);
    setOpenPositionDialog(true);
  };

  const handleDeletePosition = (positionIndex) => {
    const updatedPositions = positions.filter((_, index) => index !== positionIndex);
    setPositions(updatedPositions);
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      {/* Manage Candidates Heading */}
      <Typography variant="h4" fontWeight="bold" align="center" mb={4}>
        Manage Candidates
      </Typography>

      {/* Add Position Button */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenPositionDialog}
          sx={{
            bgcolor: "#28a745",
            color: "white",
            "&:hover": { bgcolor: "#218838" },
          }}
        >
          Add Position
        </Button>
      </Box>

      {/* Position Sections */}
      {positions.map((position, positionIndex) => (
        <Box key={positionIndex} sx={{ mb: 4, textAlign: "center" }}>
          {/* Position Title */}
          <Typography variant="h5" fontWeight="bold" mb={2}>
            {position.title}
          </Typography>

          {/* Buttons for Position */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
            <IconButton
              onClick={() => handleOpenCandidateDialog(positionIndex)}
              sx={{ color: "#28a745", "&:hover": { color: "#218838" } }}
            >
              <Add />
            </IconButton>
            <IconButton
              onClick={() => handleEditPosition(positionIndex)}
              sx={{ color: "#007bff", "&:hover": { color: "#0056b3" } }}
            >
              <Edit />
            </IconButton>
            <IconButton
              onClick={() => handleDeletePosition(positionIndex)}
              sx={{ color: "#dc3545", "&:hover": { color: "#a71d2a" } }}
            >
              <Delete />
            </IconButton>
          </Box>

          {/* Candidate Table */}
          {position.candidates.length > 0 && (
            <TableContainer
              component={Paper}
              sx={{ borderRadius: "16px", boxShadow: 4, width: "100%", margin: "0 auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#007bff" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Profile</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Course</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>School</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {position.candidates.map((candidate) => (
                    <TableRow key={candidate.id} sx={{ "&:hover": { backgroundColor: "rgba(0, 123, 255, 0.1)" } }}>
                      <TableCell>
                        <Avatar src={candidate.photo} alt={candidate.name} />
                      </TableCell>
                      <TableCell>{candidate.name}</TableCell>
                      <TableCell>{candidate.course}</TableCell>
                      <TableCell>{candidate.school}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => {
                            setCurrentCandidate({ ...candidate, positionIndex });
                            setOpenCandidateDialog(true);
                          }}
                          sx={{ color: "#007bff", "&:hover": { color: "#0056b3" } }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteCandidate(positionIndex, candidate.id)}
                          sx={{ color: "#dc3545", "&:hover": { color: "#a71d2a" } }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      ))}

      {/* Dialog for adding/editing positions */}
      <Dialog open={openPositionDialog} onClose={handleClosePositionDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: "#007bff", color: "white" }}>
          {currentPosition ? "Edit Position" : "Add Position"}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <TextField
            label="Position Title"
            fullWidth
            value={currentPosition}
            onChange={(e) => setCurrentPosition(e.target.value)}
            sx={{ mb: 3 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePositionDialog}
            sx={{ color: "#6c757d", "&:hover": { color: "#5a6268" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSavePosition}
            variant="contained"
            sx={{ bgcolor: "#28a745", color: "white", "&:hover": { bgcolor: "#218838" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for adding/editing candidates */}
      <Dialog open={openCandidateDialog} onClose={handleCloseCandidateDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ backgroundColor: "#007bff", color: "white" }}>
          {currentCandidate.id ? "Edit Candidate" : "Add New Candidate"}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {/* Bio Section */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Bio
          </Typography>
          <TextField
            label="Name"
            fullWidth
            value={currentCandidate.name}
            onChange={(e) => setCurrentCandidate({ ...currentCandidate, name: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            select
            label="Part"
            fullWidth
            value={currentCandidate.part}
            onChange={(e) => setCurrentCandidate({ ...currentCandidate, part: e.target.value })}
            sx={{ mb: 3 }}
          >
            {[1, 2, 3, 4, 5].map((part) => (
              <MenuItem key={part} value={part}>
                Part {part}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="School"
            fullWidth
            value={currentCandidate.school}
            onChange={(e) => setCurrentCandidate({ ...currentCandidate, school: e.target.value, course: "" })}
            sx={{ mb: 3 }}
          >
            {schools.map((school) => (
              <MenuItem key={school} value={school}>
                {school}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Course"
            fullWidth
            value={currentCandidate.course}
            onChange={(e) => setCurrentCandidate({ ...currentCandidate, course: e.target.value })}
            disabled={!currentCandidate.school}
            sx={{ mb: 3 }}
          >
            {currentCandidate.school &&
              courses[currentCandidate.school].map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
          </TextField>

          {/* Manifesto Section */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Manifesto
          </Typography>
          <TextField
            label="Topic"
            fullWidth
            value={currentCandidate.manifestoTopic}
            onChange={(e) => setCurrentCandidate({ ...currentCandidate, manifestoTopic: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Body"
            fullWidth
            multiline
            rows={4}
            value={currentCandidate.manifestoBody}
            onChange={(e) => setCurrentCandidate({ ...currentCandidate, manifestoBody: e.target.value })}
            sx={{ mb: 3 }}
          />

          {/* Media Section */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Media
          </Typography>
          <TextField
            label="Photo URL"
            fullWidth
            value={currentCandidate.photo}
            onChange={(e) => setCurrentCandidate({ ...currentCandidate, photo: e.target.value })}
            sx={{ mb: 3 }}
          />
          <TextField
            label="Video URL"
            fullWidth
            value={currentCandidate.video}
            onChange={(e) => setCurrentCandidate({ ...currentCandidate, video: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseCandidateDialog}
            sx={{ color: "#6c757d", "&:hover": { color: "#5a6268" } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveCandidate}
            variant="contained"
            sx={{ bgcolor: "#28a745", color: "white", "&:hover": { bgcolor: "#218838" } }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCandidates;
