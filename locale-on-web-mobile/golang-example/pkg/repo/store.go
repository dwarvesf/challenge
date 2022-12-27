package repo

// TxFunc function to finish a transaction
type TxFunc = func(store Store) error

// Store persistent data interface
type Store interface {
	DoInTransaction(txFunc TxFunc) error
}
