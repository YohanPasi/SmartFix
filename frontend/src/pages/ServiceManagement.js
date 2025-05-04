import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Alert,
    Snackbar,
    Paper,
    Divider,
    Avatar,
    Tooltip,
    useTheme,
    useMediaQuery,
    Stack,
    Badge,
    CardActionArea,
    CardActions,
    InputAdornment,
    Tabs,
    Tab,
    Menu,
    MenuItem as MuiMenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Image as ImageIcon,
    AccessTime as AccessTimeIcon,
    AttachMoney as AttachMoneyIcon,
    Category as CategoryIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Info as InfoIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Sort as SortIcon
} from '@mui/icons-material';
import { serviceService } from '../services/serviceService';

const ServiceManagement = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [services, setServices] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        requirements: [],
        isActive: true,
        availability: 'available',
        images: [],
        serviceType: 'one-time',
        equipmentProvided: false,
        materialsIncluded: false
    });
    const [newRequirement, setNewRequirement] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [filters, setFilters] = useState({
        category: '',
        serviceType: '',
        priceRange: { min: '', max: '' }
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await serviceService.getServices();
            setServices(response.data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
            setError('Failed to fetch services');
            setServices([]);
        }
    };

    const handleOpenDialog = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                description: service.description,
                price: service.price,
                category: service.category,
                requirements: service.requirements,
                isActive: service.isActive,
                availability: service.availability,
                images: [],
                serviceType: service.serviceType,
                equipmentProvided: service.equipmentProvided,
                materialsIncluded: service.materialsIncluded
            });
        } else {
            setEditingService(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                requirements: [],
                isActive: true,
                availability: 'available',
                images: [],
                serviceType: 'one-time',
                equipmentProvided: false,
                materialsIncluded: false
            });
        }
        setSelectedImages([]);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingService(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            requirements: [],
            isActive: true,
            availability: 'available',
            images: [],
            serviceType: 'one-time',
            equipmentProvided: false,
            materialsIncluded: false
        });
        setSelectedImages([]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(files);
        setFormData(prev => ({
            ...prev,
            images: files
        }));
    };

    const handleAddRequirement = () => {
        if (newRequirement.trim()) {
            setFormData(prev => ({
                ...prev,
                requirements: [...prev.requirements, newRequirement.trim()]
            }));
            setNewRequirement('');
        }
    };

    const handleRemoveRequirement = (requirement) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter(r => r !== requirement)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingService) {
                await serviceService.updateService(editingService._id, formData);
                setSuccess('Service updated successfully');
            } else {
                await serviceService.createService(formData);
                setSuccess('Service created successfully');
            }
            handleCloseDialog();
            fetchServices();
        } catch (error) {
            setError(error.message || 'Failed to save service');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                setLoading(true);
                await serviceService.deleteService(id);
                setSuccess('Service deleted successfully');
                fetchServices();
            } catch (error) {
                setError(error.message || 'Failed to delete service');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const getFilteredAndSortedServices = () => {
        let filteredServices = [...services];

        // Apply search filter
        if (searchQuery) {
            filteredServices = filteredServices.filter(service =>
                service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (filters.category) {
            filteredServices = filteredServices.filter(service =>
                service.category === filters.category
            );
        }

        // Apply service type filter
        if (filters.serviceType) {
            filteredServices = filteredServices.filter(service =>
                service.serviceType === filters.serviceType
            );
        }

        // Apply price range filter
        if (filters.priceRange.min) {
            filteredServices = filteredServices.filter(service =>
                service.price >= parseFloat(filters.priceRange.min)
            );
        }
        if (filters.priceRange.max) {
            filteredServices = filteredServices.filter(service =>
                service.price <= parseFloat(filters.priceRange.max)
            );
        }

        // Apply active/inactive filter based on tab
        if (activeTab === 1) { // Active tab
            filteredServices = filteredServices.filter(service => service.isActive);
        } else if (activeTab === 2) { // Inactive tab
            filteredServices = filteredServices.filter(service => !service.isActive);
        }

        // Apply sorting
        filteredServices.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'category':
                    comparison = a.category.localeCompare(b.category);
                    break;
                default:
                    comparison = 0;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filteredServices;
    };

    const FilterDialog = ({ open, onClose }) => (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Filter Services</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            label="Category"
                        >
                            <MenuItem value="">All Categories</MenuItem>
                            <MenuItem value="cleaning">Cleaning Services</MenuItem>
                            <MenuItem value="plumbing">Plumbing</MenuItem>
                            <MenuItem value="electrical">Electrical</MenuItem>
                            <MenuItem value="carpentry">Carpentry</MenuItem>
                            <MenuItem value="painting">Painting</MenuItem>
                            <MenuItem value="gardening">Gardening</MenuItem>
                            <MenuItem value="moving">Moving & Packing</MenuItem>
                            <MenuItem value="appliance">Appliance Repair</MenuItem>
                            <MenuItem value="pest">Pest Control</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Service Type</InputLabel>
                        <Select
                            value={filters.serviceType}
                            onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                            label="Service Type"
                        >
                            <MenuItem value="">All Types</MenuItem>
                            <MenuItem value="one-time">One-time Service</MenuItem>
                            <MenuItem value="recurring">Recurring Service</MenuItem>
                            <MenuItem value="emergency">Emergency Service</MenuItem>
                        </Select>
                    </FormControl>

                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Price Range
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Min"
                                type="number"
                                value={filters.priceRange.min}
                                onChange={(e) => handleFilterChange('priceRange', {
                                    ...filters.priceRange,
                                    min: e.target.value
                                })}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Max"
                                type="number"
                                value={filters.priceRange.max}
                                onChange={(e) => handleFilterChange('priceRange', {
                                    ...filters.priceRange,
                                    max: e.target.value
                                })}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setFilters({
                        category: '',
                        serviceType: '',
                        priceRange: { min: '', max: '' }
                    });
                }}>
                    Clear Filters
                </Button>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );

    const SortMenu = ({ anchorEl, open, onClose }) => (
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
        >
            <MuiMenuItem 
                onClick={() => {
                    handleSortChange('name');
                    onClose();
                }}
                selected={sortBy === 'name'}
            >
                Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </MuiMenuItem>
            <MuiMenuItem 
                onClick={() => {
                    handleSortChange('price');
                    onClose();
                }}
                selected={sortBy === 'price'}
            >
                Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
            </MuiMenuItem>
            <MuiMenuItem 
                onClick={() => {
                    handleSortChange('category');
                    onClose();
                }}
                selected={sortBy === 'category'}
            >
                Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
            </MuiMenuItem>
        </Menu>
    );

    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [sortAnchorEl, setSortAnchorEl] = useState(null);

    const ServiceCard = ({ service }) => (
        <Card 
            sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.shadows[8],
                    '& .MuiCardMedia-root': {
                        transform: 'scale(1.05)'
                    }
                }
            }}
        >
            <CardActionArea onClick={() => handleOpenDialog(service)}>
                <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={service.images[0]?.url || '/placeholder.jpg'}
                        alt={service.name}
                        sx={{ 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
                            display: 'flex',
                            alignItems: 'flex-end',
                            p: 2
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{ 
                                color: 'white',
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}
                        >
                            {service.name}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            gap: 1
                        }}
                    >
                        <Tooltip title={service.isActive ? "Active" : "Inactive"}>
                            <Avatar
                                sx={{
                                    width: 32,
                                    height: 32,
                                    bgcolor: service.isActive ? 'success.main' : 'error.main',
                                    boxShadow: theme.shadows[2]
                                }}
                            >
                                {service.isActive ? <CheckCircleIcon /> : <CancelIcon />}
                            </Avatar>
                        </Tooltip>
                    </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {service.description}
                    </Typography>
                    <Stack spacing={1} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AttachMoneyIcon color="primary" fontSize="small" />
                            <Typography variant="body2" fontWeight="medium">
                                ${service.price}/hour
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CategoryIcon color="primary" fontSize="small" />
                            <Typography variant="body2" fontWeight="medium">
                                {service.category}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon color="primary" fontSize="small" />
                            <Typography variant="body2" fontWeight="medium">
                                {service.serviceType}
                            </Typography>
                        </Box>
                    </Stack>
                    <Box sx={{ mb: 2 }}>
                        {service.requirements.map((req, index) => (
                            <Chip
                                key={index}
                                label={req}
                                size="small"
                                sx={{ 
                                    mr: 1, 
                                    mb: 1,
                                    backgroundColor: theme.palette.primary.light,
                                    color: 'white'
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(service)}
                    variant="outlined"
                    size="small"
                    sx={{ flex: 1 }}
                >
                    Edit
                </Button>
                <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => handleDelete(service._id)}
                    variant="outlined"
                    size="small"
                    disabled={loading}
                    sx={{ flex: 1 }}
                >
                    Delete
                </Button>
            </CardActions>
        </Card>
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 3, 
                    mb: 4,
                    background: theme.palette.background.paper,
                    borderRadius: 2
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        Service Management
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                            py: 1
                        }}
                    >
                        Add New Service
                    </Button>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                    <TextField
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        sx={{ flex: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2 }
                        }}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        onClick={() => setFilterDialogOpen(true)}
                        sx={{ borderRadius: 2 }}
                    >
                        Filter
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<SortIcon />}
                        onClick={(e) => setSortAnchorEl(e.currentTarget)}
                        sx={{ borderRadius: 2 }}
                    >
                        Sort
                    </Button>
                </Stack>

                <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{ mb: 3 }}
                >
                    <Tab label="All Services" />
                    <Tab label="Active" />
                    <Tab label="Inactive" />
                </Tabs>

                <Grid container spacing={3}>
                    {getFilteredAndSortedServices().map((service) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={service._id}>
                            <ServiceCard service={service} />
                        </Grid>
                    ))}
                </Grid>

                {getFilteredAndSortedServices().length === 0 && (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: 200 
                    }}>
                        <Typography variant="h6" color="text.secondary">
                            No services found
                        </Typography>
                    </Box>
                )}
            </Paper>

            <FilterDialog 
                open={filterDialogOpen} 
                onClose={() => setFilterDialogOpen(false)} 
            />

            <SortMenu 
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={() => setSortAnchorEl(null)}
            />

            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog} 
                maxWidth="md" 
                fullWidth
                fullScreen={isMobile}
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    pb: 2
                }}>
                    <Typography variant="h5" fontWeight="bold">
                        {editingService ? 'Edit Service' : 'Add New Service'}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Service Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    multiline
                                    rows={4}
                                    required
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Price (per hour)"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    variant="outlined"
                                    InputProps={{
                                        startAdornment: <AttachMoneyIcon color="action" sx={{ mr: 1 }} />,
                                        sx: { borderRadius: 2 }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        label="Category"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="cleaning">Cleaning Services</MenuItem>
                                        <MenuItem value="plumbing">Plumbing</MenuItem>
                                        <MenuItem value="electrical">Electrical</MenuItem>
                                        <MenuItem value="carpentry">Carpentry</MenuItem>
                                        <MenuItem value="painting">Painting</MenuItem>
                                        <MenuItem value="gardening">Gardening</MenuItem>
                                        <MenuItem value="moving">Moving & Packing</MenuItem>
                                        <MenuItem value="appliance">Appliance Repair</MenuItem>
                                        <MenuItem value="pest">Pest Control</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Service Type</InputLabel>
                                    <Select
                                        name="serviceType"
                                        value={formData.serviceType}
                                        onChange={handleInputChange}
                                        required
                                        label="Service Type"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="one-time">One-time Service</MenuItem>
                                        <MenuItem value="recurring">Recurring Service</MenuItem>
                                        <MenuItem value="emergency">Emergency Service</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ p: 2, background: theme.palette.background.default }}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Requirements
                                    </Typography>
                                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Add Requirement"
                                            value={newRequirement}
                                            onChange={(e) => setNewRequirement(e.target.value)}
                                            variant="outlined"
                                            size="small"
                                            sx={{ borderRadius: 2 }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={handleAddRequirement}
                                            disabled={!newRequirement.trim()}
                                            sx={{ borderRadius: 2 }}
                                        >
                                            Add
                                        </Button>
                                    </Stack>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {formData.requirements.map((req, index) => (
                                            <Chip
                                                key={index}
                                                label={req}
                                                onDelete={() => handleRemoveRequirement(req)}
                                                color="primary"
                                                sx={{ borderRadius: 2 }}
                                            />
                                        ))}
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<ImageIcon />}
                                    fullWidth
                                    sx={{ borderRadius: 2 }}
                                >
                                    Upload Images
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                                {selectedImages.length > 0 && (
                                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                        {selectedImages.length} image(s) selected
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.equipmentProvided}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                equipmentProvided: e.target.checked
                                            }))}
                                        />
                                    }
                                    label="Equipment Provided"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.materialsIncluded}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                materialsIncluded: e.target.checked
                                            }))}
                                        />
                                    }
                                    label="Materials Included"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                isActive: e.target.checked
                                            }))}
                                        />
                                    }
                                    label="Active"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Availability</InputLabel>
                                    <Select
                                        name="availability"
                                        value={formData.availability}
                                        onChange={handleInputChange}
                                        label="Availability"
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <MenuItem value="available">Available</MenuItem>
                                        <MenuItem value="unavailable">Unavailable</MenuItem>
                                        <MenuItem value="limited">Limited Availability</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Button 
                        onClick={handleCloseDialog}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        color="primary"
                        sx={{ borderRadius: 2 }}
                    >
                        {editingService ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    severity="error" 
                    onClose={() => setError(null)}
                    sx={{ borderRadius: 2 }}
                >
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!success}
                autoHideDuration={6000}
                onClose={() => setSuccess(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    severity="success" 
                    onClose={() => setSuccess(null)}
                    sx={{ borderRadius: 2 }}
                >
                    {success}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ServiceManagement; 