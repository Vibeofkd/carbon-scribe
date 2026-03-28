package minting

import (
	"context"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}

	// Migrate schemas.
	err = db.AutoMigrate(&MintingJob{}, &MintedToken{})
	if err != nil {
		t.Fatalf("failed to migrate models: %v", err)
	}

	// Create a dummy project for testing.
	db.Exec("CREATE TABLE projects (id UUID PRIMARY KEY, name TEXT, methodology_token_id INTEGER, vintage_year INTEGER)")
	return db
}

func TestMintProjectCredits(t *testing.T) {
	db := setupTestDB(t)
	mockClient := &mockContractClient{}
	service := NewService(db, mockClient)

	projectID := uuid.New()
	db.Exec("INSERT INTO projects (id, name, methodology_token_id, vintage_year) VALUES (?, ?, ?, ?)", projectID, "Test Project", 123, 2024)

	ctx := context.Background()
	job, err := service.MintProjectCredits(ctx, projectID, nil)

	assert.NoError(t, err)
	assert.NotNil(t, job)
	assert.Equal(t, projectID, job.ProjectID)
	assert.Equal(t, "pending", job.Status)

	// Wait for async processing to finish.
	time.Sleep(1500 * time.Millisecond)

	var updatedJob MintingJob
	db.First(&updatedJob, job.ID)
	assert.Equal(t, "completed", updatedJob.Status)
	assert.NotEmpty(t, updatedJob.TxHash)

	var tokens []MintedToken
	db.Where("job_id = ?", job.ID).Find(&tokens)
	assert.Len(t, tokens, 1)
	assert.Equal(t, 123, tokens[0].MethodologyID)
}

func TestGetMintingStatus(t *testing.T) {
	db := setupTestDB(t)
	service := NewService(db, &mockContractClient{})

	projectID := uuid.New()
	job := &MintingJob{ProjectID: projectID, Status: "completed"}
	db.Create(job)

	tokens := []MintedToken{
		{JobID: job.ID, ProjectID: projectID, TokenID: 1, VintageYear: 2024, MethodologyID: 101},
		{JobID: job.ID, ProjectID: projectID, TokenID: 2, VintageYear: 2024, MethodologyID: 101},
	}
	db.Create(&tokens)

	ctx := context.Background()
	foundJobs, foundTokens, err := service.GetMintingStatus(ctx, projectID)

	assert.NoError(t, err)
	assert.Len(t, foundJobs, 1)
	assert.Len(t, foundTokens, 2)
}
