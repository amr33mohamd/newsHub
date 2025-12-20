<?php

namespace App\Repositories;

use App\Models\Source;

class SourceRepository
{
    /**
     * The Source model instance
     *
     * @var Source
     */
    protected $source;

    /**
     * SourceRepository constructor.
     *
     * @param Source $source
     */
    public function __construct(Source $source)
    {
        $this->source = $source;
    }

    /**
     * Get all active sources
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllSources()
    {
        return $this->source->where('is_active', true)->get();
    }

    /**
     * Get source by ID
     *
     * @param int $id
     * @return Source
     */
    public function getSourceById($id)
    {
        return $this->source->findOrFail($id);
    }

    /**
     * Get source by API identifier
     *
     * @param string $apiIdentifier
     * @return Source|null
     */
    public function findByApiIdentifier(string $apiIdentifier): ?Source
    {
        return $this->source->where('api_identifier', $apiIdentifier)->first();
    }
}
