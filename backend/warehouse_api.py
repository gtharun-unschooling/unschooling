#!/usr/bin/env python3
"""
Warehouse Management API
Simple Flask API to execute warehouse management system from frontend
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import os
import json
import time
from pathlib import Path

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

@app.route('/api/warehouse/run-system', methods=['POST'])
def run_warehouse_system():
    """Execute the complete warehouse management system."""
    try:
        print("🏭 API: Starting warehouse management system...")
        
        # Get the backend directory path
        backend_dir = Path(__file__).parent
        
        # Run the warehouse system script
        result = subprocess.run(
            ['python3', 'run_warehouse_system.py'],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes timeout
        )
        
        if result.returncode == 0:
            # Check what files were generated
            generated_files = []
            expected_files = [
                'warehouse_report.md',
                'scaling_report.json',
                'comprehensive_materials_table.md',
                'warehouse_inventory_table.md',
                'scaling_analysis_table.md'
            ]
            
            for file_name in expected_files:
                file_path = backend_dir / file_name
                if file_path.exists():
                    file_size = file_path.stat().st_size
                    generated_files.append({
                        'name': file_name,
                        'size': f"{file_size / 1024:.1f} KB",
                        'exists': True
                    })
                else:
                    generated_files.append({
                        'name': file_name,
                        'size': '0 KB',
                        'exists': False
                    })
            
            return jsonify({
                'success': True,
                'message': 'Warehouse management system completed successfully!',
                'output': result.stdout,
                'generated_files': generated_files,
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Warehouse system execution failed',
                'error': result.stderr,
                'return_code': result.returncode
            }), 500
            
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'message': 'Warehouse system execution timed out (took longer than 5 minutes)'
        }), 408
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error executing warehouse system: {str(e)}'
        }), 500

@app.route('/api/warehouse/status', methods=['GET'])
def get_warehouse_status():
    """Get current warehouse system status and generated files."""
    try:
        backend_dir = Path(__file__).parent
        
        # Check what files exist and their sizes
        files_status = []
        expected_files = [
            'warehouse_report.md',
            'scaling_report.json',
            'comprehensive_materials_table.md',
            'warehouse_inventory_table.md',
            'scaling_analysis_table.md',
            'warehouse.db'
        ]
        
        total_size = 0
        for file_name in expected_files:
            file_path = backend_dir / file_name
            if file_path.exists():
                file_size = file_path.stat().st_size
                total_size += file_size
                files_status.append({
                    'name': file_name,
                    'size': f"{file_size / 1024:.1f} KB",
                    'exists': True,
                    'last_modified': time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(file_path.stat().st_mtime))
                })
            else:
                files_status.append({
                    'name': file_name,
                    'size': '0 KB',
                    'exists': False,
                    'last_modified': None
                })
        
        return jsonify({
            'success': True,
            'warehouse_status': {
                'total_files': len([f for f in files_status if f['exists']]),
                'total_size': f"{total_size / 1024:.1f} KB",
                'files': files_status,
                'last_updated': time.strftime('%Y-%m-%d %H:%M:%S')
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error getting warehouse status: {str(e)}'
        }), 500

@app.route('/api/warehouse/generate-report', methods=['POST'])
def generate_business_report():
    """Generate business intelligence report."""
    try:
        print("📊 API: Generating business intelligence report...")
        
        backend_dir = Path(__file__).parent
        
        # Run the warehouse system script
        result = subprocess.run(
            ['python3', 'run_warehouse_system.py'],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            timeout=300
        )
        
        if result.returncode == 0:
            return jsonify({
                'success': True,
                'message': 'Business intelligence report generated successfully!',
                'output': result.stdout,
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Report generation failed',
                'error': result.stderr
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error generating report: {str(e)}'
        }), 500

@app.route('/api/warehouse/scaling-analysis', methods=['POST'])
def run_scaling_analysis():
    """Run scaling analysis for 60 children."""
    try:
        print("🚀 API: Running scaling analysis for 60 children...")
        
        backend_dir = Path(__file__).parent
        
        # Run the warehouse system script
        result = subprocess.run(
            ['python3', 'run_warehouse_system.py'],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            timeout=300
        )
        
        if result.returncode == 0:
            return jsonify({
                'success': True,
                'message': 'Scaling analysis completed successfully!',
                'output': result.stdout,
                'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Scaling analysis failed',
                'error': result.stderr
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error running scaling analysis: {str(e)}'
        }), 500

@app.route('/api/warehouse/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'service': 'Warehouse Management API',
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print("🚀 Starting Warehouse Management API...")
    print(f"📍 API will be available at: http://localhost:{port}")
    print("🔗 Endpoints:")
    print("  - POST /api/warehouse/run-system")
    print("  - GET  /api/warehouse/status")
    print("  - POST /api/warehouse/generate-report")
    print("  - POST /api/warehouse/scaling-analysis")
    print("  - GET  /api/warehouse/health")
    
    app.run(host='0.0.0.0', port=port, debug=False)
