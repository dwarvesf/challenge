package entities

import (
	"github.com/dwarvesf/go-template/pkg/config"
	"github.com/dwarvesf/go-template/pkg/repo"
)

type entity struct {
	cfg  config.Config
	repo repo.Store
	// log  logger.Log
}
type Entity interface {
}

// l logger.Log
func New(cfg config.Config, r repo.Store) Entity {
	return &entity{
		cfg:  cfg,
		repo: r,
	}
}
